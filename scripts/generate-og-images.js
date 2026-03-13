import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';

const COVERS_DIR = 'static/covers';
const OG_DIR = 'static/og';
const WIDTH = 1200;
const HEIGHT = 630;

if (!existsSync(OG_DIR)) mkdirSync(OG_DIR, { recursive: true });

const svgs = readdirSync(COVERS_DIR).filter((f) => extname(f) === '.svg');

for (const file of svgs) {
	const name = basename(file, '.svg');
	const out = join(OG_DIR, `${name}.png`);
	await sharp(join(COVERS_DIR, file))
		.resize(WIDTH, HEIGHT, { fit: 'cover' })
		.png()
		.toFile(out);
	console.log(`  ${file} -> ${out}`);
}

console.log(`Generated ${svgs.length} OG image(s)`);
