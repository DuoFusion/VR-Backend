
export class apiResponse {
    private status: number | null
    private message: string | null
    private data: any | null
    private error: any | null
    constructor(status: number, message: string, data: any, error: any) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}

export const userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload"
}
export const WORKSHOP_STATUS = {

    PENDING :"pending",
    COMPLETED :"completed",
    CANCELLED :"cancelled"
}
export const WORKSHOP_LEVEL = {
    BEGINNER :"beginner",
    INTERMEDIATE :"intermediate",
    ADVANCED :"advanced"
}

export const COURSE_DISCOUNT = {
    PERCENTAGE: "percentage",
    FIXED: "fixed"
}

export const COURSE_LEVEL = {
    BEGINNER :"beginner",
    INTERMEDIATE :"intermediate",
    ADVANCED :"advanced"
}
export const COURSE_REGISTER_PAYMENT_METHOD = {

    CARD :"card",
    UPI :"UPI",
    NETBANKING :"NetBanking"
}

export const COURSE_REGISTER_PAYMENT_STATUS = {

    PENDING :"Pending",
    SUCCESS :"Success",
    FAILED :"Failed"
}
export const COURSE_REGISTER_GENDER = {
    MALE :"male",
    FEMALE :"female",
    OTHER :"other"
}

export const WORKSHOP_REGISTER_PAYMENT_METHOD = {

    CARD :"card",
    UPI :"UPI",
    NETBANKING :"NetBanking"
}

export const WORKSHOP_REGISTER_PAYMENT_STATUS = {

    PENDING :"Pending",
    SUCCESS :"Success",
    FAILED :"Failed"
}

export const WORKSHOP_REGISTER_GENDER = {
    MALE :"male",
    FEMALE :"female",
    OTHER :"other"

}