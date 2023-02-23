module.exports = {
  apps: [
    {
      name: 'my-app',
      script: 'node',
      args: 'ace serve',
      interpreter_args: '--es-module-specifier-resolution=node',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      force: false,
      cron: false
    }
  ]
}
