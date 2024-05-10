import { spawn, exec } from "child_process";
//var count = 0;

async function rebuild () {
  await exec("esbuild js/*.js --bundle --platform=browser --minify --tree-shaking=true --target=chrome112,firefox111,edge112,safari16 --outdir=lib/  --log-level=verbose", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
 });
}

var server = spawn("http-server",["\"./\"", "-c-1","--gzip", "--cors", "-p", "8080"],{shell:true});

server.stdout.on("data", (data) => {
  //if (count & 1) rebuild();
  //++count;
  //if (count > 1) count = 0;
  rebuild();
  console.log(`stdout: ${data}`);
});

server.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

server.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});