module.exports = {
  apps: [
    {
      script: 'app.js',
      watch: true,
      name: 'yyds-tools:3000',
      // cwd: '/node-next-framework/projects/lt.cncoders.tech',
      cwd: __dirname,
      ignore_watch: ['.next', 'data', 'public', 'package.json', '.git', '.gitignore', '.next', 'node_modules'],
      error_file: './data/logs/error.log',
      min_uptime: '60s',
      node_args: '--harmony',
      env: {
        NODE_ENV: 'development',
      },
      max_memory_restart: '300M',
    },
  ],
};
