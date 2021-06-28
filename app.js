'use strict';

const edge = require('edge-js');
const fs = require('fs');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

let openport;
let clearbuffer;
let printlabel;
let closeport;
let windowsfont;

try {
    openport = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'openport'
    });
} catch (error) {
    console.log(error);
}

try {
    clearbuffer = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'clearbuffer'
    });
} catch (error) {
    console.log(error);
}

try {
    printlabel = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'printlabel'
    });
} catch (error) {
    console.log(error);
}

try {
    closeport = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'closeport'
    });
} catch (error) {
    console.log(error);
}

try {
    windowsfont = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_usb',
        methodName: 'windowsfont'
    });
} catch (error) {
    console.log(error);
}

const print = ({ filePath, quantity, copy, fontFamily, fontSize, x, top }) => {
    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
        throw err;
    }
    const lines = fileContent.split('\n');
    const windowsfont_variable = {
        x,
        fontheight: fontSize,
        rotation: 0,
        fontstyle: 0, //0-> Normal, 1-> Italic, 2-> Bold, 3-> Bold and Italic,
        fontunderline: 0, // 0-> without underline, 1->underline,
        szFaceName: fontFamily,
    };
    const label_variable = { quantity, copy };
    openport('');
    clearbuffer('', true);
    let y = fontSize - 2;
    lines.forEach((line, i) => {
        windowsfont({
            ...windowsfont_variable,
            y: top + i * y,
            content: line
        }, true);
    });
    printlabel(label_variable, true);
    closeport('', true);
};

if (argv.usage) {
    console.log('+------------------------------------+');
    console.log('|       WELCOME TO TSPL-Printer      |');
    console.log('+------------------------------------+');
    console.log('Description:');
    console.log('  This is an executable to send print commands to a TSPL printer such as TSC DA210');
    console.log('Prerequisites:');
    console.log('  You must have the Windows printer driver installed first');
    console.log('  see https://www.tscprinters.com/EN/support/support_download/DA210-DA220_Series');
    console.log('Usage:');
    console.log('  $> node.exe --filePath=print.txt');
    console.log('             [--quantity=1]       ');
    console.log('             [--copy=1]           ');
    console.log('             [--fontFamily=Arial] ');
    console.log('             [--fontSize=32]      ');
    console.log('             [--left=150]         ');
    console.log('             [--top=30]           ');
    return 0;
}

try {
    print({
        filePath: argv.filePath,
        quantity: argv.quantity.toString() || '1',
        copy: argv.copy.toString() || '1',
        fontFamily: argv.fontFamily || 'Consolas',
        fontSize: argv.fontSize || 32,
        x: argv.left || 150,
        top: argv.top || 30,
    });
    console.log('Printed successfully');
    return 0;
} catch (err) {
    console.error(err);
    return 1;
}
