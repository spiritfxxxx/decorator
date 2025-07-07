// Simulated in-memory "database"
const stepResults = new Map<string, any>();


// Step decorator: logs, memoizes step results
export function Step(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;


  descriptor.value = async function (...args: any[]) {
    const stepKey = `${propertyKey}:${JSON.stringify(args)}`;


    if (stepResults.has(stepKey)) {
      console.log(`🔁 Reusing result of step "${propertyKey}" with args ${JSON.stringify(args)}`);
      return stepResults.get(stepKey);
    }


    console.log(`▶️ Executing step "${propertyKey}"`);
    const result = await originalMethod.apply(this, args);
    stepResults.set(stepKey, result);
    console.log(`✅ Step "${propertyKey}" completed with result: ${JSON.stringify(result)}`);
    return result;
  };
}


// Workflow decorator: tracks workflow execution start and end
export function Workflow(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;


  descriptor.value = async function (...args: any[]) {
    console.log(`🚀 Starting workflow "${propertyKey}"`);
    try {
      const result = await originalMethod.apply(this, args);
      console.log(`🎉 Workflow "${propertyKey}" completed.`);
      return result;
    } catch (error) {
      console.error(`❌ Workflow "${propertyKey}" failed:`, error);
      throw error;
    }
  };
}
