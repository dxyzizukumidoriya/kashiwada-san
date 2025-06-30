const chokidar = require("chokidar");
const path = require("node:path");
const fs = require("node:fs");
const { promisify } = require("node:util");
const chalk = require("chalk");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const Scandir = async (dir) => {
  let subdirs = await readdir(path.resolve(dir));
  let files = await Promise.all(
    subdirs.map(async (subdir) => {
      let res = path.resolve(path.resolve(dir), subdir);
      return (await stat(res)).isDirectory() ? Scandir(res) : res;
    }),
  );
  return files.reduce((a, f) => a.concat(f), []);
};

class Scraper {
  #src;
  constructor(dir) {
    this.dir = dir;
    this.#src = {};
  }

  async #loadModule(filename) {
    const name = path.basename(filename).replace(/\.(js|mjs)$/, '');
    
    try {
      if (filename.endsWith('.mjs')) {
        // Dynamic import for ESM modules
        this.#src[name] = (await import(`file://${filename}`)).default
      } else if (filename.endsWith('.js')) {
        // Regular require for CommonJS
        if (require.cache[filename]) delete require.cache[filename];
        this.#src[name] = require(filename);
      }
    } catch (e) {
      console.log(chalk.red.bold(`- Gagal memuat Scraper ${name}: ${e.message}`));
      delete this.#src[name];
    }
  }

  load = async () => {
    let data = await Scandir("./scrapers/src");
    for (let filename of data) {
      if (filename.endsWith(".js") || filename.endsWith(".mjs")) {
        await this.#loadModule(filename);
      }
    }
    return this.#src;
  };

  watch = async () => {
    const watcher = chokidar.watch(path.resolve(this.dir), {
      persistent: true,
      ignoreInitial: true,
    });

    const handleFileChange = async (filename, event) => {
      if (!filename.endsWith(".js") && !filename.endsWith(".mjs")) return;
      
      const name = path.basename(filename).replace(/\.(js|mjs)$/, '');
      
      try {
        await this.#loadModule(filename);
        const actionMessages = {
          add: `- Scraper Baru telah ditambahkan: ${name}`,
          change: `- Scraper telah diubah: ${name}`,
          unlink: `- Scraper telah dihapus: ${name}`
        };
        if (actionMessages[event]) {
          console.log(chalk.cyan.bold(actionMessages[event]));
        }
      } catch (e) {
        console.log(chalk.red.bold(`- Gagal memproses ${event} untuk ${name}: ${e.message}`));
      }
    };

    watcher.on("add", (filename) => handleFileChange(filename, 'add'));
    watcher.on("change", (filename) => handleFileChange(filename, 'change'));
    watcher.on("unlink", (filename) => {
      if (!filename.endsWith(".js") && !filename.endsWith(".mjs")) return;
      const name = path.basename(filename).replace(/\.(js|mjs)$/, '');
      delete this.#src[name];
      console.log(chalk.cyan.bold(`- Scraper telah dihapus: ${name}`));
    });

    return watcher;
  };

  list = () => this.#src;
}

module.exports = Scraper;
