import type { IED, RequestForm } from "./types"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type RequestFormState = Partial<RequestForm> & {
    setData: (data: Partial<RequestForm>) => void
}

export const useRequestStore = create<RequestFormState>()(
    persist(
        (set) => ({
            setData: (data) => set(data)
        }),
        {
            name: "request-form-storage", // unique name
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used))
        }
    )
)

export const useInputTypeStore = create(
    (set) => ({
        setData: (data: string[]) => set(data)
    })
)
