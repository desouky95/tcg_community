import { useUsers } from "./useUsers"
import { useChecklists } from "./useChecklists"
import { useCategories } from "./useCategories"

export const useDashboardStats = () => {

    const { data: users, isLoading } = useUsers()
    const { data: collections, isLoading: collectionsLoading } = useChecklists()
    const { data: categories, isLoading: categoriesLoading } = useCategories()

    const loading = isLoading || collectionsLoading || categoriesLoading
    return {
        users,
        collections,
        categories,
        isLoading: loading
    }
}