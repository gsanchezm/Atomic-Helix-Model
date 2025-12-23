import { Before, After, Status } from '@cucumber/cucumber';
import type { CustomWorld } from '@/test/world';
import { env } from '@/config/env';

function safeName(name: string) {
  return name.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 120);
}

Before(async function (this: CustomWorld) {
  // Ensure web is ready for scenarios tagged @web (you can refine with tag checks if you want)
  if (this.ctx.executionContext.platform !== 'web') return;

  await this.initWeb();

  // Start trace (optional)
  // Only do traces locally or when explicitly enabled
  if (process.env.PW_TRACE === 'true') {
    const context = this.ctx.playwright!.page.context();
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }
});

After(async function (this: CustomWorld, scenario) {
  if (this.ctx.executionContext.platform !== 'web') {
    await this.dispose();
    return;
  }

  const page = this.ctx.playwright?.page;

  // Attach screenshot on failure
  if (page && scenario.result?.status === Status.FAILED) {
    const png = await page.screenshot({ fullPage: true });
    // Cucumber attach -> Allure reporter will include it
    await this.attach(png, 'image/png');
  }

  // Stop and attach trace (optional)
  if (page && process.env.PW_TRACE === 'true') {
    const context = page.context();
    const traceName = safeName(scenario.pickle.name);
    const tracePath = `allure-results/trace_${traceName}.zip`;
    await context.tracing.stop({ path: tracePath });

    // Attach trace file (as binary)
    // Cucumber attach accepts Buffer; read file into buffer
    const fs = await import('node:fs/promises');
    const buf = await fs.readFile(tracePath);
    await this.attach(buf, 'application/zip');
  }

  await this.dispose();
});
