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

const print = ({ filePath, quantity, copy, fontFamily, fontSize, x, top, printerName }) => {
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
    console.log(printerName);
    openport(printerName || '');
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
    closeport(printerName || '', true);
};
const printUsage = () => {
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
    console.log('             [--printerName=TSC]  ');
};

if (argv.usage) {
    printUsage();
    return 0;
}

try {
    print({
        filePath: argv.filePath,
        quantity: typeof argv.quantity === 'number' ? Math.round(argv.quantity).toString() : '1',
        copy: typeof argv.copy === 'number' ? Math.round(argv.copy).toString() : '1',
        fontFamily: argv.fontFamily || 'Consolas',
        fontSize: typeof argv.fontSize === 'number' ? Math.round(argv.fontSize) : 32,
        x: typeof argv.left === 'number' ? Math.round(argv.left) : 150,
        top: typeof argv.top === 'number' ? Math.round(argv.top) : 30,
        printerName: argv.printerName,
    });
    console.log('Printed successfully');
    return 0;
} catch (err) {
    console.error(err);
    printUsage();
    return 1;
}
