/**
 * @jest-environment node
 */
import compiler from './helpers/compiler';
import { getAsset, getChunk, getFileNames } from './helpers/misc';

describe('simple case', () => {
    let output: any;

    beforeAll(async () => {
        output = await compiler('fixtures/simple/main.js');
    });

    it('should return 3 assets', async () => {
        const assets = getFileNames(output);
        expect(assets.length).toBe(3);
        expect(assets).toContain('main.js');
        expect(assets).toContain('assets/main.nl.js');
        expect(assets).toContain('assets/main.en.js');
    });

    it('should output main bundle with references to messages', async () => {
        const source = getChunk(output, 'main.js')?.code;
        expect(source).toContain('/assets/main.nl.js');
        expect(source).toContain('/assets/main.en.js');
    });

    it('should output *nl* messages bundle with "Dit is een test"', async () => {
        const source = getAsset(output, 'assets/main.nl.js')?.source;
        expect(source).toContain('key1_');
        expect(source).toContain('Dit is een test');
    });

    it('should output *nl* messages bundle which is minified', async () => {
        const source = getAsset(output, 'assets/main.en.js')?.source;
        expect(source).toBeTruthy();
        var newLines = (source!.toString().match(/\n/g) || []).length;
        expect(newLines).toBeLessThanOrEqual(1);
    });

    it('should output *en* messages bundle with "This is a test"', async () => {
        const source = getAsset(output, 'assets/main.en.js')?.source;
        expect(source).toContain('key1_');
        expect(source).toContain('This is a test');
    });
});
