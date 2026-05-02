import * as dashboardRepository from "../repositories/dashboard.repository";

export const getInventoryValue = async (): Promise<number> => {
    const inventoryValue: number = await dashboardRepository.getInventoryValue();
    return inventoryValue;
};