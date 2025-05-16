"use client"

import { useComputed, useSignal } from "@preact/signals-react"

export default function PROFILE() {
    //useSignals()
    const sig = useSignal(0)

    return <div onClick={() => sig.value++} > profile { useComputed(() => sig.value * 10) }</div>
}