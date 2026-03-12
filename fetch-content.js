const https = require('https');
const fs = require('fs');
const path = require('path');

async function fetchFromGitHub(url, callback) {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(null, JSON.parse(data));
        });
    }).on('error', (err) => {
        callback(err, null);
    });
}

async function fetchDirectoryContents(dirUrl, basePath, prefixToRemove) {
    fetchFromGitHub(dirUrl, async (err, files) => {
        if (err) {
            console.error('Error fetching files:', err.message);
            return;
        }

        for (const file of files) {
            const relativePath = file.path.replace(new RegExp(`^${prefixToRemove}`), '');
            const filePath = path.join(basePath, relativePath);

            if (file.type === 'file') {
                await downloadAndSaveFile(file.download_url, filePath);
            } else if (file.type === 'dir') {
                await fetchDirectoryContents(file.url, basePath, prefixToRemove); // Recursive call for subdirectories
            }
        }
    });
}

async function downloadAndSaveFile(url, filePath) {
    const fullFilePath = path.join(__dirname, filePath);

    https.get(url, (res) => {
        const directory = path.dirname(fullFilePath);

        // Ensure the directory exists
        fs.mkdirSync(directory, { recursive: true });

        const fileStream = fs.createWriteStream(fullFilePath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log('Downloaded and saved:', filePath);
        });
    }).on('error', (err) => {
        console.error('Error downloading file:', err.message);
    });
}

const repositories = [
    {
        baseUrl: 'https://api.github.com/repos/logos-messaging/logos-delivery/contents/docs/benchmarks',
        baseSavePath: '/docs/learn/research/benchmarks/',
        prefixToRemove: "docs/benchmarks/",
        categoryFileContent: "{ \"label\": \"Benchmarks\", \"collapsed\": false }"
    },
    {
        baseUrl: 'https://api.github.com/repos/logos-messaging/research/contents/docs',
        baseSavePath: '/docs/learn/research/research-and-studies/',
        prefixToRemove: "docs/",
        categoryFileContent: "{ \"label\": \"Research and Studies\", \"collapsed\": false }"
    }
];

repositories.forEach(repo => {
    fs.rmSync(path.join(__dirname, repo.baseSavePath), { recursive: true, force: true });
});

repositories.forEach(repo => {
    fetchDirectoryContents(repo.baseUrl, repo.baseSavePath, repo.prefixToRemove, repo.categoryFileContent).then(() => {
        const dir = path.join(__dirname, repo.baseSavePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "_category_.json"), repo.categoryFileContent);
    });
});
