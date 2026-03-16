import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const BUILD_DIR = 'build';
const BRANCH = 'gh-pages';

if (!existsSync(BUILD_DIR)) {
	console.error(`"${BUILD_DIR}" 디렉토리가 없습니다. 먼저 빌드를 실행하세요.`);
	process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

try {
	process.chdir(BUILD_DIR);

	run('git init');
	run('git checkout -B ' + BRANCH);
	run('git add -A');
	run('git commit -m "deploy"');

	const remote = execSync('git -C .. remote get-url origin', { encoding: 'utf-8' }).trim();
	run(`git push -f ${remote} ${BRANCH}`);

	console.log('\n배포 완료.');
} catch (e) {
	console.error('배포 실패:', e.message);
	process.exit(1);
}
