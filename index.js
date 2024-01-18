const Hulipaa = require('hulipaa')
const fs = require('fs')
const path = require('path')

const dataFolder = 'data'
const pagesFolder = 'pages'

// Clean pages directory
if (fs.existsSync(pagesFolder)) {
    fs.rmSync(pagesFolder,{ recursive: true })
}
fs.mkdirSync(pagesFolder)

// Generate web pages
const dataFiles = fs.readdirSync(dataFolder)
const createdPages = []
for (let dataFileName of dataFiles) {
    const dataFullPath = path.join(dataFolder,dataFileName)
    const dataFileContent = fs.readFileSync(dataFullPath,'utf8')

    const dataOfPage = JSON.parse(dataFileContent)

    const { title,content } = dataOfPage

    const html = `<html><head><title>${title}</title></head><body><h1>${title}</h1>${content}</body></html>`

    const pageName = `${path.parse(dataFileName).name}.html`
    const pageFullPath = path.join(pagesFolder,pageName)
    fs.writeFileSync(pageFullPath,html)
    createdPages.push([pageName,pageFullPath])
}


// Generate main web page
let htmlFiles = fs.readdirSync('.').filter(fileName => path.extname(fileName) === '.html')
htmlFiles = htmlFiles.filter(fileName => fileName !== 'index.html')

const htmlListHtmlFiles = htmlFiles.map(fileName => `<li><a href="${fileName}">${fileName}</a></li>`)
const htmlListGeneratedPages = createdPages.map(([page,path]) => `<li><a href="${path}">${page}</a></li>`).join('')
const htmlIndexFile = `<html><head><title>Main page</title></head><body>
    <p>Html Pages</p><ul>${htmlListHtmlFiles}</ul>
    <p>Generated Pages</p><ul>${htmlListGeneratedPages}</ul>
</body></html>`

fs.writeFileSync('index.html',htmlIndexFile)

Hulipaa({
    inputFolder: 'data',
    parseData: function (fileContent,filePath) {
        const parsedFile = JSON.parse(fileContent)
        return {
            text: parsedFile.content,
            title: parsedFile.title,
            path: filePath
        }
    },
    generateLink: function (fileName,inputFolder) {
        const nameWithoutExtension = path.parse(fileName).name
        return `/pages/${nameWithoutExtension}.html`
    },
    outputFolder: 'search'
})
