import { Step, Workflow } from "./workflow";


class UserOnboardingWorkflow {
  @Step
  async createUser(name: string) {
    console.log(`Creating user: ${name}`);
    return { userId: "u-" + name.toLowerCase() };
  }


  @Step
  async sendWelcomeEmail(userId: string) {
    console.log(`Sending welcome email to user: ${userId}`);
    return true;
  }


  @Workflow
  async onboardUser(name: string) {
    const user = await this.createUser(name);
    await this.sendWelcomeEmail(user.userId);
  }
}


// Run it
const wf = new UserOnboardingWorkflow();
wf.onboardUser("Alice").then(() => {
  console.log("\n🔄 Rerunning the workflow (should reuse steps)\n");
  wf.onboardUser("Alice");
});
