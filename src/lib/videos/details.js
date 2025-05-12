import { Link, Globe, Lock } from "lucide-react"

export const categories = [
    'Education',
    'Entertainment',
    'Gaming',
    'Music',
    'Technology',
    'Sports',
    'Travel',
    'Other',
]

export const visibilites = [
    {type: 'Public', icon: Globe},
    {type: 'Unlisted', icon: Link},
    {type: 'Private', icon: Lock},
]