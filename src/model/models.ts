export interface Subscription {
    user_name: string
    plan_id: string
    start_date: string
}

export interface CompareResponse {
    upgradeToHigherPlan: boolean
    cost: number
}