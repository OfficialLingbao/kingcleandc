const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './images';
const webpQuality = 80;
const jpegQuality = 85;

// Create WebP versions of all images
async function optimizeImages(directory) {
    try {
        const files = await fs.promises.readdir(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.promises.stat(filePath);
            
            if (stats.isDirectory()) {
                await optimizeImages(filePath);
                continue;
            }
            
            const ext = path.extname(file).toLowerCase();
            if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
            
            const filename = path.basename(file, ext);
            const webpPath = path.join(directory, `${filename}.webp`);
            const optimizedPath = path.join(directory, `${filename}_optimized${ext}`);
            
            // Create WebP version
            await sharp(filePath)
                .webp({ quality: webpQuality })
                .toFile(webpPath);
                
            // Create optimized version of original format
            await sharp(filePath)
                .jpeg({ quality: jpegQuality })
                .toFile(optimizedPath);
                
            console.log(`Optimized: ${file}`);
        }
    } catch (err) {
        console.error('Error optimizing images:', err);
    }
}

// Update HTML files to use picture element with WebP
async function updateHtmlFiles() {
    const htmlDir = './';
    const files = await fs.promises.readdir(htmlDir);
    
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        let html = await fs.promises.readFile(path.join(htmlDir, file), 'utf8');
        
        // Replace img tags with picture elements
        html = html.replace(
            /<img([^>]+)src=["']([^"']+)["']([^>]*)>/g,
            (match, before, src, after) => {
                const ext = path.extname(src);
                const webpSrc = src.replace(ext, '.webp');
                return `
                    <picture>
                        <source srcset="${webpSrc}" type="image/webp">
                        <img${before}src="${src}"${after}>
                    </picture>
                `;
            }
        );
        
        await fs.promises.writeFile(path.join(htmlDir, file), html);
        console.log(`Updated: ${file}`);
    }
}

// Add lazy loading to images
async function addLazyLoading() {
    const htmlDir = './';
    const files = await fs.promises.readdir(htmlDir);
    
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        let html = await fs.promises.readFile(path.join(htmlDir, file), 'utf8');
        
        // Add loading="lazy" to img tags
        html = html.replace(
            /<img([^>]+)>/g,
            '<img$1 loading="lazy">'
        );
        
        await fs.promises.writeFile(path.join(htmlDir, file), html);
        console.log(`Added lazy loading to: ${file}`);
    }
}

// Run optimization tasks
async function main() {
    console.log('Starting image optimization...');
    await optimizeImages(imageDir);
    
    console.log('Updating HTML files to use WebP...');
    await updateHtmlFiles();
    
    console.log('Adding lazy loading to images...');
    await addLazyLoading();
    
    console.log('Image optimization complete!');
}

main();
