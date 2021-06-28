# Build a TSPL-Printer executable to print text content from a file


## Documents
- https://www.tscprinters.com/EN/support/support_download/DA210-DA220_Series
- https://github.com/nvbach91/tspl-printer/blob/master/TSC_DLL_instruction_E.pdf
- https://github.com/nvbach91/tspl-printer/blob/master/TSPL_TSPL2_Programming.pdf

## How to
- Use node.js 14.17.1
- Generate the executable
```bash
npm install -g pkg
npm install
pkg package.json
```
- Copy dependencies (native addons) from `/node_modules` to `/dist`
  - `edge-cs`
  - `edge-js`
  - `nan`
  - tsclibnet.dll
- Run `/dist/node.exe --usage` to show executable usage
```bash
Description:
  This is an executable to send print commands to a TSPL printer such as TSC DA210
Prerequisites:
  You must have the Windows printer driver installed first
  see https://www.tscprinters.com/EN/support/support_download/DA210-DA220_Series
Usage:
  $> node.exe --filePath=print.txt
             [--quantity=1]
             [--copy=1]
             [--fontFamily=Arial]
             [--fontSize=32]
             [--left=150]
             [--top=30]
```

## Tested on Models 
- TSC DA10


