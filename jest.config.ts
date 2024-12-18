module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
    },
    moduleNameMapper: {
      '^src/(.*)': '<rootDir>/src/$1',  // Mapeia o alias 'src' para o diretório correto
    },
    moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  };
  