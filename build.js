const fs=require('node:fs');
fs.mkdirSync('dist',{recursive:true});
for(const file of ['nexus-social-v1.png','index.html','app.html','account.html','account.js','nexus.css','workspace.js','runtime.json','robots.txt','sitemap.xml','llms.txt'])fs.copyFileSync(file,'dist/'+file);
fs.cpSync('.well-known','dist/.well-known',{recursive:true});
console.log('Built public Nexus files.');
