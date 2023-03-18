const chokidar = require('chokidar');
const { spawn } = require('child_process');

const watcher = chokidar.watch('./node_modules', {
  ignored: /(^|[\/\\])\../, // 忽略所有点开头的文件和文件夹
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', (event, path) => {
  console.log(`File ${path} has been ${event}`);
  main()
});

const main = () => {
  const res = spawn('npm', ['run', 'dev']);
  res.stdout.on('data', function (data) {
    // console.log(data + '');
  });
  res.stderr.on('data', function (data) {
    // console.log(data + '');
  });
}
main()