module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/vue3-recommended',
        'plugin:import/typescript',
    ],
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: [
        'vue',
        '@typescript-eslint',
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
            'babel-eslint': ['.js', '.jsx', '.json'],
        },
        'import/extensions': ['.ts', '.tsx', '.js', '.jsx'],
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
        },
    },
    overrides: [{
        files: ['*.ts', '*.vue'],
        rules: {
            'no-undef': 'off',
        },
    }],
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'object-curly-newline': 'off',
        'vue/object-curly-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'import/no-cycle': [2, { maxDepth: 1 }],
        'max-len': 'off',
        'no-shadow': 'off',
        'no-param-reassign': ['error', { props: false }],
        'vue/html-indent': ['error', 'tab'],
        'vue/script-setup-uses-vars': 'off',
        'array-bracket-spacing': ['error', 'never'],
        'new-cap': 'off',
        'jest/no-jest-import': 'off',
        'no-tabs': 'off',
        'no-new': 'off',
        'no-unused-vars': 'off',
        'no-mixed-operators': 'off',
        'no-useless-return': 'off',
        'no-useless-constructor': 'off',
        'no-useless-catch': 'off',
        'no-useless-escape': 'off',
        'no-console': 'off',
        indent: [2, 4, { VariableDeclarator: 1 }],
        // ????????????????????????
        semi: [2, 'always'],
        // ????????????????????????
        'semi-spacing': [0, { before: false, after: true }],
        // ??????function???????????????
        'space-before-function-paren': 0,
        // allow async-await
        'generator-star-spacing': 'off',
        // ??????????????? tab ???????????????
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        // ?????????????????????
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // ??????????????????????????????????????????????????????????????????????????????????????????????????????,0????????????2??????
        'no-unneeded-ternary': [0, { defaultAssignment: true }],
        camelcase: 0,
        // ???????????????????????????????????????
        'quote-props': ['error', 'as-needed'],
        'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true, optionalDependencies: true, peerDependencies: true }],

    },
};
