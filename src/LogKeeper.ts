export class LogKeeper {
  private logsStack: { name: string; message: string }[] = [];

  constructor(private showLogsAfter: boolean = false) {}

  get prettyLogs() {
    return this.preparePrettyLogs();
  }

  addLog(name: string, message: string) {
    this.logsStack.push({ name, message });
  }

  showLogsIfNeed() {
    if (this.showLogsAfter) {
      this.showLogs();
    }
  }

  forceShowLogs() {
    this.showLogs();
  }

  private showLogs() {
    console.log(this.preparePrettyLogs());
  }

  private preparePrettyLogs() {
    const maxNameLength = this.logsStack.reduce((maxLength, log) => {
      return log.name.length > maxLength ? log.name.length : maxLength;
    }, 0);

    return this.logsStack.map((log) => {
      const spaces = new Array(maxNameLength - log.name.length).fill(' ').join('');
      return `${spaces}${log.name} | ${log.message}`;
    });
  }
}
