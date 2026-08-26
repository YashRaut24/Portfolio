const dns = require('node:dns');

// Force IPv4 DNS resolution first (prevents ENETUNREACH IPv6 connection timeouts on Render/cloud containers)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});