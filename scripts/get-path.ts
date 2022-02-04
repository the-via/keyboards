
import path from 'path';
export function getDefinitionsPath(version = 'v2') {
    return path.join(__dirname, '..',version === 'v2' ? 'src/**/*.json' : `${version}/**/*.json`)
}
export function getCommonMenusPath() {
    return path.resolve(__dirname, '..','common-menus')
}
export function getOutputPath() {
    return path.resolve(process.argv[2] || 'dist');
}