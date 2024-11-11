module.exports = {
  compilationOptions: {
    preferredConfigPath: '../tsconfig.json',
  },
  entries: [
    {
      filePath: '../dist/index.d.ts',
      outFile: '../dist/layout.d.ts',
      libraries: {
        inlinedLibraries: ['tiny-emitter'],
      },
      output: {
        inlineDeclareGlobals: true,
        exportReferencedTypes: false,
        umdModuleName: 'Layout',
      },
    },
  ],
};
