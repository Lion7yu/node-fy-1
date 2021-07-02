#!/usr/bin/env node
import { translate } from "./main";
const { Command } = require('commander');

const program = new Command();

program
  .version('0.0.1')
  .name('翻译')
  .usage('<English>')
  .argument('<English>')
  .action((english: string)=>{
    translate(english)
  })
program.parse(process.argv)