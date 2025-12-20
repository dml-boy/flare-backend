
import * as dotenv from 'dotenv';
import * as dns from 'dns';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

console.log("DATABASE_URL found (masked):");
// Mask password
const maskedUrl = dbUrl.replace(/(:[^:@]+@)/, ':****@');
console.log(maskedUrl);

let host: string | null = null;
let port: number = 27017;
let protocol: string = 'mongodb';

try {
  // Attempt to parse with URL class (works for mongodb:// standard URIs)
  // Note: mongodb+srv might not parse well depending on node version's URL support for non-special schemes, 
  // but usually it mimics http format enough for hostname.
  // However, mongodb+srv URIs don't have ports usually.
  const myUrl = new URL(dbUrl);
  host = myUrl.hostname;
  port = myUrl.port ? parseInt(myUrl.port) : 27017;
  protocol = myUrl.protocol.replace(':', '');
} catch (e) {
  console.log("Standard URL parsing failed, trying RegExp fallback...");
  // Fallback regex
  const match = dbUrl.match(/^(?:mongodb(?:\+srv)?):\/\/(?:[^:@]+:[^:@]+@)?([^:/?]+)(?::(\d+))?/);
  if (match) {
    host = match[1];
    port = match[2] ? parseInt(match[2]) : 27017;
    if (dbUrl.startsWith('mongodb+srv')) protocol = 'mongodb+srv';
  }
}

if (!host) {
  console.error("Could not parse host from DATABASE_URL");
  process.exit(1);
}

console.log(`\nParsed Protocol: ${protocol}`);
console.log(`Parsed Host: ${host}`);
if (protocol !== 'mongodb+srv') {
  console.log(`Parsed Port: ${port}`);
}

console.log(`\n--- 1. Testing DNS Resolution for ${host} ---`);
if (protocol === 'mongodb+srv') {
  console.log("Using mongodb+srv, checking SRV records...");
  dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
    if (err) {
      console.error(`SRV DNS Lookup failed: ${err.message}`);
      console.log("Trying standard A record lookup as fallback check...");
      checkARecord(host!);
    } else {
      console.log(`SRV Lookup successful. Found ${addresses.length} records.`);
      if (addresses.length > 0) {
        const target = addresses[0];
        console.log(`Target: ${target.name}:${target.port}`);
        checkConnectivity(target.name, target.port);
      }
    }
  });
} else {
  // Standard A record check
  checkARecord(host);
}

function checkARecord(hostname: string) {
  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      console.error(`DNS Lookup failed: ${err.message}`);
    } else {
      console.log(`DNS Lookup successful: ${address} (IPv${family})`);
      checkConnectivity(address, port);
    }
  });
}

function checkConnectivity(address: string, port: number) {
  console.log(`\n--- 2. Testing TCP Connection to ${address}:${port} ---`);
  const client = new net.Socket();
  client.setTimeout(5000); // 5s timeout

  client.connect(port, address, () => {
    console.log('TCP Connection established successfully!');
    client.destroy();
  });

  client.on('error', (err) => {
    console.error(`TCP Connection failed: ${err.message}`);
    // Check for specific error codes
    if ((err as any).code === 'ENETUNREACH') {
      console.error("Analysis: The network is unreachable. Check your internet connection or VPN.");
    } else if ((err as any).code === 'ETIMEDOUT') {
      console.error("Analysis: Connection timed out. Firewall or wrong host/port.");
    }
    client.destroy();
  });

  client.on('timeout', () => {
    console.error('TCP Connection timed out');
    client.destroy();
  });
}
