"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = Step;
exports.Workflow = Workflow;
// Simulated in-memory "database"
const stepResults = new Map();
// Step decorator: logs, memoizes step results
function Step(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepKey = `${propertyKey}:${JSON.stringify(args)}`;
            if (stepResults.has(stepKey)) {
                console.log(`🔁 Reusing result of step "${propertyKey}" with args ${JSON.stringify(args)}`);
                return stepResults.get(stepKey);
            }
            console.log(`▶️ Executing step "${propertyKey}"`);
            const result = yield originalMethod.apply(this, args);
            stepResults.set(stepKey, result);
            console.log(`✅ Step "${propertyKey}" completed with result: ${JSON.stringify(result)}`);
            return result;
        });
    };
}
// Workflow decorator: tracks workflow execution start and end
function Workflow(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🚀 Starting workflow "${propertyKey}"`);
            try {
                const result = yield originalMethod.apply(this, args);
                console.log(`🎉 Workflow "${propertyKey}" completed.`);
                return result;
            }
            catch (error) {
                console.error(`❌ Workflow "${propertyKey}" failed:`, error);
                throw error;
            }
        });
    };
}
