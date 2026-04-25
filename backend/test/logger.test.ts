import { describe, expect, it, spyOn } from "bun:test";
import { logger } from "../src/lib/logger";

describe("Logger", () => {
  it("should log message in JSON format", () => {
    const logSpy = spyOn(console, "log");
    logger.info("Test message", { key: "value" });
    
    expect(logSpy).toHaveBeenCalled();
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.message).toBe("Test message");
    expect(output.level).toBe("info");
    expect(output.key).toBe("value");
    expect(output.timestamp).toBeDefined();
    
    logSpy.mockRestore();
  });

  it("should log error in JSON format", () => {
    const errorSpy = spyOn(console, "error");
    logger.error("Error message");
    
    expect(errorSpy).toHaveBeenCalled();
    const output = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(output.message).toBe("Error message");
    expect(output.level).toBe("error");
    
    errorSpy.mockRestore();
  });
});
