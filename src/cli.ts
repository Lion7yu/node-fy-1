const { Command } = require('commander');
const program = new Command();

program.version('0.0.1')
  .name('翻译')
  .usage('<english>')

program.parse(process.argv)