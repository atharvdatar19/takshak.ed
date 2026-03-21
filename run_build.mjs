import { exec } from 'child_process';
import fs from 'fs';

console.log("Starting build...");
exec('npm run build', (error, stdout, stderr) => {
  fs.writeFileSync('build_error_safe.txt', stdout + '\n' + stderr, 'utf8');
  console.log("Build finished, log saved.");
});
