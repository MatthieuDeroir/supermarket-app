// modules/logs/dal/log.repository.ts
import { GenericRepository } from "../../generic.repository.ts";
import { Log } from "../log.model.ts";

export class LogRepository extends GenericRepository<Log> {
    constructor() {
        super({
            tableName: "Logs",
            primaryKey: "logId",
        });
    }
}

const logRepository = new LogRepository();
export default logRepository;
