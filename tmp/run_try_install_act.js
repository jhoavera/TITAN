const s = require('./api/scripts/ci/ensure-tools.ts');
process.env.ENSURE_TOOLS_ALLOW_SUDO='1';
const runner = (cmd) => {
  console.log('CMD:', cmd);
  if (cmd.includes('command -v act')) return { status: 1, pid: 0, stdout: Buffer.from('') };
  if (cmd.includes('curl -fsSL -o')) return { status: 0, pid: 0, stdout: Buffer.from('ok') };
  if (cmd.includes('$HOME/.local/bin') && cmd.includes('mv')) return { status: 1, pid: 0, stdout: Buffer.from('') };
  if (cmd.includes('/usr/local/bin/act') && cmd.includes('mv') && !cmd.startsWith('sudo ')) return { status: 1, pid: 0, stdout: Buffer.from('') };
  if (cmd.startsWith('sudo mv')) return { status: 0, pid: 0, stdout: Buffer.from('') };
  if (cmd.includes('chmod')) return { status: 0, pid: 0, stdout: Buffer.from('') };
  if (cmd.includes('uname -s')) return { status: 0, pid: 0, stdout: Buffer.from('Linux') };
  if (cmd.includes('uname -m')) return { status: 0, pid: 0, stdout: Buffer.from('x86_64') };
  return { status: 0, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') };
};
console.log(s.tryInstallAct(runner));
