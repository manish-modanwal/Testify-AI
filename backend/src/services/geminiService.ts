import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please add your key to the backend's .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


interface FileSummary {
    title: string;
    description: string;
    framework: string;
    complexity: 'Low' | 'Medium' | 'High';
    filesCovered: string[];
    fileName: string; 
}

const FRAMEWORK_PROMPTS: { [key: string]: { testCases: string; summary: string; code: string; } } = {
    'jest': {
        testCases: `You are a test case generator for a Node.js application. Your task is to generate test cases for the following file using Jest. Use Jest's global functions like 'describe', 'it', and 'expect'. For mocking, use Jest's dedicated mocking functions such as 'jest.fn()' and 'jest.mock()'.`,
        summary: `The test cases should be tailored for the Jest test framework.`,
        code: `Use the Jest test framework. Use Jest's global functions like 'describe', 'it', and 'expect'. For mocking, use Jest's dedicated mocking functions such as 'jest.fn()' and 'jest.mock()'.`,
    },
    'mocha': {
        testCases: `You are a test case generator for a Node.js application. Your task is to generate test cases for the following file using Mocha and the Chai assertion library. Use Mocha's 'describe' and 'it' functions, and for assertions, use Chai's 'expect' or 'assert' syntax (e.g., 'expect(value).to.be.a('string')'). Do not use any Jest-specific syntax.`,
        summary: `The test cases should be tailored for the Mocha test framework with Chai.`,
        code: `Use the Mocha and Chai test framework. Use Mocha's 'describe' and 'it' functions, and for assertions, use Chai's 'expect' or 'assert' syntax (e.g., 'expect(value).to.be.a('string')'). Do not use any Jest-specific syntax.`,
    },
    'cypress': {
        testCases: `You are a test case generator for a web application. Your task is to generate end-to-end test cases for the following file using Cypress. Use Cypress's global functions like 'describe', 'it', and 'cy' commands (e.g., 'cy.visit()', 'cy.get()').`,
        summary: `The test cases should be tailored for the Cypress test framework.`,
        code: `Use the Cypress test framework. Use Cypress's global functions like 'describe', 'it', and 'cy' commands (e.g., 'cy.visit()', 'cy.get()').`,
    },
    'pytest': {
        testCases: `You are a test case generator for a Python application. Your task is to generate test cases for the following file using PyTest. Use PyTest's test function conventions (e.g., functions starting with 'test_') and fixtures.`,
        summary: `The test cases should be tailored for the PyTest framework.`,
        code: `Use the PyTest framework. Use PyTest's test function conventions (e.g., functions starting with 'test_') and fixtures.`,
    },
    'selenium': {
        testCases: `You are a test case generator for a web application. Your task is to generate automation test cases for the following file using Selenium WebDriver in Python. Use standard Selenium commands to interact with web elements.`,
        summary: `The test cases should be tailored for the Selenium framework.`,
        code: `Use the Selenium framework with Python. Use standard Selenium WebDriver commands to interact with web elements.`,
    },
    'junit': {
        testCases: `You are a test case generator for a Java application. Your task is to generate test cases for the following file using JUnit 5. Use JUnit annotations like '@Test', '@BeforeEach', and assertions like 'Assertions.assertEquals()'.`,
        summary: `The test cases should be tailored for the JUnit 5 framework.`,
        code: `Use the JUnit 5 framework. Use JUnit annotations like '@Test', '@BeforeEach', and assertions like 'Assertions.assertEquals()'.`,
    },
    'googletest': {
        testCases: `You are a test case generator for a C/C++ application. Your task is to generate test cases for the following file using GoogleTest. Use macros like 'TEST()' and 'ASSERT_EQ()'.`,
        summary: `The test cases should be tailored for the GoogleTest framework.`,
        code: `Use the GoogleTest framework. Use macros like 'TEST()' and 'ASSERT_EQ()'.`,
    },
    'nunit': {
        testCases: `You are a test case generator for a C# application. Your task is to generate test cases for the following file using NUnit. Use attributes like '[Test]', '[SetUp]', and assertions like 'Assert.AreEqual()'.`,
        summary: `The test cases should be tailored for the NUnit framework.`,
        code: `Use the NUnit framework. Use attributes like '[Test]', '[SetUp]', and assertions like 'Assert.AreEqual()'.`,
    },
    'xunit': {
        testCases: `You are a test case generator for a C# application. Your task is to generate test cases for the following file using xUnit.net. Use attributes like '[Fact]', and assertions from the 'Assert' class.`,
        summary: `The test cases should be tailored for the xUnit.net framework.`,
        code: `Use the xUnit.net framework. Use attributes like '[Fact]', and assertions from the 'Assert' class.`,
    },
    'phpunit': {
        testCases: `You are a test case generator for a PHP application. Your task is to generate test cases for the following file using PHPUnit. Extend the 'TestCase' class and use methods like 'assertEquals()'.`,
        summary: `The test cases should be tailored for the PHPUnit framework.`,
        code: `Use the PHPUnit framework. Extend the 'TestCase' class and use methods like 'assertEquals()'.`,
    },
    'rspec': {
        testCases: `You are a test case generator for a Ruby application. Your task is to generate test cases for the following file using RSpec. Use the 'describe' and 'it' blocks.`,
        summary: `The test cases should be tailored for the RSpec framework.`,
        code: `Use the RSpec framework. Use the 'describe' and 'it' blocks.`,
    },
    'testing': {
        testCases: `You are a test case generator for a Go application. Your task is to generate test cases for the following file using Go's built-in 'testing' package. Use functions like 'TestSomething' and assertions from 't'.`,
        summary: `The test cases should be tailored for Go's 'testing' package.`,
        code: `Use Go's built-in 'testing' package. Use functions like 'TestSomething' and assertions from 't'.`,
    },
    'cargotest': {
        testCases: `You are a test case generator for a Rust application. Your task is to generate test cases for the following file using Rust's 'cargo test' framework. Use the '#[test]' attribute.`,
        summary: `The test cases should be tailored for the 'cargo test' framework.`,
        code: `Use Rust's 'cargo test' framework. Use the '#[test]' attribute.`,
    },
};

const getPromptText = (type: 'testCases' | 'summary' | 'code', language: string, framework: string): string => {
    const promptConfig = FRAMEWORK_PROMPTS[framework.toLowerCase()];
    if (!promptConfig) {
        return `You are an expert software engineer. Your task is to write test cases for the following ${language} file.`;
    }
    return promptConfig[type];
};

/**
 * Generates structured test summaries for a list of file contents.
 *
 * @param files An array of objects, each containing fileName and fileContent.
 * @param language The programming language of the files.
 * @param framework The testing framework to use.
 * @returns A promise that resolves to an array of structured FileSummary objects.
 */
export const generateTestSummaries = async (files: { fileName: string; content: string; }[], language: string, framework: string): Promise<FileSummary[]> => {
    if (!files || files.length === 0) {
        throw new Error('Invalid input: files must be a non-empty array.');
    }

    const allFileSummaries: FileSummary[] = [];
    const frameworkPrompt = getPromptText('summary', language, framework);

    // Iterate through each file and generate a detailed summary individually
    for (const file of files) {
        const prompt = `
            You are an expert software engineer.
            Your task is to analyze the following ${language} code and generate a single test case summary in JSON format.
            The summary should include a title, a detailed description of what the test will accomplish, the testing framework used, the complexity of the test, and a list of files covered by this test.
            
            The JSON object should have the following strict structure:
            \`\`\`json
            {
                "title": "A short, descriptive title for the test case",
                "description": "A detailed explanation of the test case, including the functionality being tested, any edge cases considered, and the expected outcomes.",
                "framework": "The name of the testing framework used (e.g., Jest, Mocha, PyTest).",
                "complexity": "The complexity level of the test case, chosen from: 'Low', 'Medium', or 'High'.",
                "filesCovered": ["A list of file names that this test case would cover, including the primary file being tested."]
            }
            \`\`\`
            
            ${frameworkPrompt}
            
            Here is the code to analyze:
            File Name: ${file.fileName}
            \`\`\`${language}
            ${file.content}
            \`\`\`
            
            Provide only the complete JSON object and nothing else. Do not include any extra text, markdown, or code block delimiters outside of the JSON.
        `;

        try {
            const result = await geminiModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Clean up any extraneous characters and parse the JSON
            const cleanedText = text.replace(/```json\n|```/g, '').trim();
            const summaryObject: FileSummary = JSON.parse(cleanedText);
            
            
            summaryObject.fileName = file.fileName;
            allFileSummaries.push(summaryObject);
        } catch (error) {
            console.error('Error generating or parsing summary for a file:', error);
            
            allFileSummaries.push({
                title: 'Error Generating Summary',
                description: `Failed to generate a detailed summary for ${file.fileName}.`,
                framework: framework,
                complexity: 'Medium',
                filesCovered: [file.fileName],
                fileName: file.fileName,
            });
        }
    }

    return allFileSummaries;
};

export const generateCodeFromSummary = async (fileContent: string, fileName: string, summary: string, language: string, framework: string) => {
    const promptInstructions = getPromptText('code', language, framework);
    const prompt = `
        You are an expert software developer. Your task is to write a single, complete, and executable test case for the following ${language} file. The test case should specifically address the summary provided.
        ${promptInstructions}

        File: ${fileName}
        Code:
        \`\`\`${language}
        ${fileContent}
        \`\`\`

        Test Summary to implement: "${summary}"
        
        Provide only the full, executable test code block, without any additional text or explanations.
    `;

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('Error generating code from summary:', error);
        throw new Error('Failed to generate test code from summary.');
    }
};

const SUPPORTED_LANGUAGES: { [key: string]: { frameworks: string[]; extensions: string[] } } = {
    'javascript/typescript': { frameworks: ['jest', 'mocha', 'cypress'], extensions: ['js', 'jsx', 'ts', 'tsx'] },
    'python': { frameworks: ['pytest', 'selenium'], extensions: ['py', 'pyw'] },
    'java': { frameworks: ['junit'], extensions: ['java'] },
    'c/c++': { frameworks: ['googletest'], extensions: ['c', 'cpp', 'cc', 'cxx'] },
    'c#': { frameworks: ['nunit', 'xunit'], extensions: ['cs'] },
    'php': { frameworks: ['phpunit'], extensions: ['php'] },
    'ruby': { frameworks: ['rspec'], extensions: ['rb'] },
    'go': { frameworks: ['testing'], extensions: ['go'] },
    'rust': { frameworks: ['cargotest'], extensions: ['rs'] },
};

export const getFileLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    for (const lang in SUPPORTED_LANGUAGES) {
        if (SUPPORTED_LANGUAGES[lang].extensions.includes(extension || '')) {
            return lang;
        }
    }
    return 'text';
};