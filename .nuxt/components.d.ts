
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'CartRelatedProducts': typeof import("../components/cart/relatedProducts.vue")['default']
    'CollectionFilterSidebar': typeof import("../components/collection/FilterSidebar.vue")['default']
    'CollectionPage': typeof import("../components/collection/collectionPage.vue")['default']
    'CommonFooter': typeof import("../components/common/Footer.vue")['default']
    'CommonHeader': typeof import("../components/common/Header.vue")['default']
    'CommonProductCard': typeof import("../components/common/ProductCard.vue")['default']
    'CommonTopBar': typeof import("../components/common/TopBar.vue")['default']
    'CommonVideoCard': typeof import("../components/common/VideoCard.vue")['default']
    'HomeBannerComponent': typeof import("../components/home/BannerComponent.vue")['default']
    'HomeCategorySlider': typeof import("../components/home/CategorySlider.vue")['default']
    'HomeFitsSection': typeof import("../components/home/FitsSection.vue")['default']
    'HomeHeadline': typeof import("../components/home/Headline.vue")['default']
    'HomeHeadline2': typeof import("../components/home/Headline2.vue")['default']
    'HomeHeroSection': typeof import("../components/home/HeroSection.vue")['default']
    'HomePremiumCategories': typeof import("../components/home/PremiumCategories.vue")['default']
    'HomeShopBy': typeof import("../components/home/ShopBy.vue")['default']
    'HomeTrendingProducts': typeof import("../components/home/TrendingProducts.vue")['default']
    'HomeVisitStore': typeof import("../components/home/VisitStore.vue")['default']
    'HomeStars': typeof import("../components/home/stars.vue")['default']
    'LoginNewUserForm': typeof import("../components/login/NewUserForm.vue")['default']
    'LoginOtpInput': typeof import("../components/login/OtpInput.vue")['default']
    'LoginPhoneNumberInput': typeof import("../components/login/PhoneNumberInput.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyCartRelatedProducts': LazyComponent<typeof import("../components/cart/relatedProducts.vue")['default']>
    'LazyCollectionFilterSidebar': LazyComponent<typeof import("../components/collection/FilterSidebar.vue")['default']>
    'LazyCollectionPage': LazyComponent<typeof import("../components/collection/collectionPage.vue")['default']>
    'LazyCommonFooter': LazyComponent<typeof import("../components/common/Footer.vue")['default']>
    'LazyCommonHeader': LazyComponent<typeof import("../components/common/Header.vue")['default']>
    'LazyCommonProductCard': LazyComponent<typeof import("../components/common/ProductCard.vue")['default']>
    'LazyCommonTopBar': LazyComponent<typeof import("../components/common/TopBar.vue")['default']>
    'LazyCommonVideoCard': LazyComponent<typeof import("../components/common/VideoCard.vue")['default']>
    'LazyHomeBannerComponent': LazyComponent<typeof import("../components/home/BannerComponent.vue")['default']>
    'LazyHomeCategorySlider': LazyComponent<typeof import("../components/home/CategorySlider.vue")['default']>
    'LazyHomeFitsSection': LazyComponent<typeof import("../components/home/FitsSection.vue")['default']>
    'LazyHomeHeadline': LazyComponent<typeof import("../components/home/Headline.vue")['default']>
    'LazyHomeHeadline2': LazyComponent<typeof import("../components/home/Headline2.vue")['default']>
    'LazyHomeHeroSection': LazyComponent<typeof import("../components/home/HeroSection.vue")['default']>
    'LazyHomePremiumCategories': LazyComponent<typeof import("../components/home/PremiumCategories.vue")['default']>
    'LazyHomeShopBy': LazyComponent<typeof import("../components/home/ShopBy.vue")['default']>
    'LazyHomeTrendingProducts': LazyComponent<typeof import("../components/home/TrendingProducts.vue")['default']>
    'LazyHomeVisitStore': LazyComponent<typeof import("../components/home/VisitStore.vue")['default']>
    'LazyHomeStars': LazyComponent<typeof import("../components/home/stars.vue")['default']>
    'LazyLoginNewUserForm': LazyComponent<typeof import("../components/login/NewUserForm.vue")['default']>
    'LazyLoginOtpInput': LazyComponent<typeof import("../components/login/OtpInput.vue")['default']>
    'LazyLoginPhoneNumberInput': LazyComponent<typeof import("../components/login/PhoneNumberInput.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const CartRelatedProducts: typeof import("../components/cart/relatedProducts.vue")['default']
export const CollectionFilterSidebar: typeof import("../components/collection/FilterSidebar.vue")['default']
export const CollectionPage: typeof import("../components/collection/collectionPage.vue")['default']
export const CommonFooter: typeof import("../components/common/Footer.vue")['default']
export const CommonHeader: typeof import("../components/common/Header.vue")['default']
export const CommonProductCard: typeof import("../components/common/ProductCard.vue")['default']
export const CommonTopBar: typeof import("../components/common/TopBar.vue")['default']
export const CommonVideoCard: typeof import("../components/common/VideoCard.vue")['default']
export const HomeBannerComponent: typeof import("../components/home/BannerComponent.vue")['default']
export const HomeCategorySlider: typeof import("../components/home/CategorySlider.vue")['default']
export const HomeFitsSection: typeof import("../components/home/FitsSection.vue")['default']
export const HomeHeadline: typeof import("../components/home/Headline.vue")['default']
export const HomeHeadline2: typeof import("../components/home/Headline2.vue")['default']
export const HomeHeroSection: typeof import("../components/home/HeroSection.vue")['default']
export const HomePremiumCategories: typeof import("../components/home/PremiumCategories.vue")['default']
export const HomeShopBy: typeof import("../components/home/ShopBy.vue")['default']
export const HomeTrendingProducts: typeof import("../components/home/TrendingProducts.vue")['default']
export const HomeVisitStore: typeof import("../components/home/VisitStore.vue")['default']
export const HomeStars: typeof import("../components/home/stars.vue")['default']
export const LoginNewUserForm: typeof import("../components/login/NewUserForm.vue")['default']
export const LoginOtpInput: typeof import("../components/login/OtpInput.vue")['default']
export const LoginPhoneNumberInput: typeof import("../components/login/PhoneNumberInput.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyCartRelatedProducts: LazyComponent<typeof import("../components/cart/relatedProducts.vue")['default']>
export const LazyCollectionFilterSidebar: LazyComponent<typeof import("../components/collection/FilterSidebar.vue")['default']>
export const LazyCollectionPage: LazyComponent<typeof import("../components/collection/collectionPage.vue")['default']>
export const LazyCommonFooter: LazyComponent<typeof import("../components/common/Footer.vue")['default']>
export const LazyCommonHeader: LazyComponent<typeof import("../components/common/Header.vue")['default']>
export const LazyCommonProductCard: LazyComponent<typeof import("../components/common/ProductCard.vue")['default']>
export const LazyCommonTopBar: LazyComponent<typeof import("../components/common/TopBar.vue")['default']>
export const LazyCommonVideoCard: LazyComponent<typeof import("../components/common/VideoCard.vue")['default']>
export const LazyHomeBannerComponent: LazyComponent<typeof import("../components/home/BannerComponent.vue")['default']>
export const LazyHomeCategorySlider: LazyComponent<typeof import("../components/home/CategorySlider.vue")['default']>
export const LazyHomeFitsSection: LazyComponent<typeof import("../components/home/FitsSection.vue")['default']>
export const LazyHomeHeadline: LazyComponent<typeof import("../components/home/Headline.vue")['default']>
export const LazyHomeHeadline2: LazyComponent<typeof import("../components/home/Headline2.vue")['default']>
export const LazyHomeHeroSection: LazyComponent<typeof import("../components/home/HeroSection.vue")['default']>
export const LazyHomePremiumCategories: LazyComponent<typeof import("../components/home/PremiumCategories.vue")['default']>
export const LazyHomeShopBy: LazyComponent<typeof import("../components/home/ShopBy.vue")['default']>
export const LazyHomeTrendingProducts: LazyComponent<typeof import("../components/home/TrendingProducts.vue")['default']>
export const LazyHomeVisitStore: LazyComponent<typeof import("../components/home/VisitStore.vue")['default']>
export const LazyHomeStars: LazyComponent<typeof import("../components/home/stars.vue")['default']>
export const LazyLoginNewUserForm: LazyComponent<typeof import("../components/login/NewUserForm.vue")['default']>
export const LazyLoginOtpInput: LazyComponent<typeof import("../components/login/OtpInput.vue")['default']>
export const LazyLoginPhoneNumberInput: LazyComponent<typeof import("../components/login/PhoneNumberInput.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
