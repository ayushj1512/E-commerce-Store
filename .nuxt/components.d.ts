
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


export const TopBar: typeof import("../components/TopBar.vue")['default']
export const CartCard: typeof import("../components/cart/CartCard.vue")['default']
export const CartEmptyCart: typeof import("../components/cart/EmptyCart.vue")['default']
export const CartConfetti: typeof import("../components/cart/confetti.vue")['default']
export const CartRelatedProducts: typeof import("../components/cart/relatedProducts.vue")['default']
export const CheckoutAddressSelector: typeof import("../components/checkout/CheckoutAddressSelector.vue")['default']
export const CollectionAvailableVoucher: typeof import("../components/collection/AvailableVoucher.vue")['default']
export const CollectionFilterDrawer: typeof import("../components/collection/FilterDrawer.vue")['default']
export const CollectionFilterSidebar: typeof import("../components/collection/FilterSidebar.vue")['default']
export const CollectionPage: typeof import("../components/collection/collectionPage.vue")['default']
export const CommonFooter: typeof import("../components/common/Footer.vue")['default']
export const CommonGlobalNotification: typeof import("../components/common/GlobalNotification.vue")['default']
export const CommonGlobalToast: typeof import("../components/common/GlobalToast.vue")['default']
export const CommonHeader: typeof import("../components/common/Header.vue")['default']
export const CommonHeaderSearch: typeof import("../components/common/HeaderSearch.vue")['default']
export const CommonProductCard: typeof import("../components/common/ProductCard.vue")['default']
export const CommonProductHorizontalList: typeof import("../components/common/ProductHorizontalList.vue")['default']
export const CommonScrollToTopButton: typeof import("../components/common/ScrollToTopButton.vue")['default']
export const CommonShareButton: typeof import("../components/common/ShareButton.vue")['default']
export const CommonVideoCard: typeof import("../components/common/VideoCard.vue")['default']
export const CommonElectricBorder: typeof import("../components/common/electricBorder.vue")['default']
export const CommonErrorHandler: typeof import("../components/common/errorHandler.vue")['default']
export const HeaderCartIcon: typeof import("../components/header/CartIcon.vue")['default']
export const HeaderProfileIcon: typeof import("../components/header/ProfileIcon.vue")['default']
export const HeaderWishlistIcon: typeof import("../components/header/WishlistIcon.vue")['default']
export const HomeBannerComponent: typeof import("../components/home/BannerComponent.vue")['default']
export const HomeCategorySlider: typeof import("../components/home/CategorySlider.vue")['default']
export const HomeFitsSection: typeof import("../components/home/FitsSection.vue")['default']
export const HomeHeadline: typeof import("../components/home/Headline.vue")['default']
export const HomeHeadline2: typeof import("../components/home/Headline2.vue")['default']
export const HomeHeroSection: typeof import("../components/home/HeroSection.vue")['default']
export const HomeInstaGallery: typeof import("../components/home/InstaGallery.vue")['default']
export const HomePremiumCategories: typeof import("../components/home/PremiumCategories.vue")['default']
export const HomeRecentlyViewedProducts: typeof import("../components/home/RecentlyViewedProducts.vue")['default']
export const HomeShopBy: typeof import("../components/home/ShopBy.vue")['default']
export const HomeTrendingProducts: typeof import("../components/home/TrendingProducts.vue")['default']
export const HomeVisitStore: typeof import("../components/home/VisitStore.vue")['default']
export const HomeStars: typeof import("../components/home/stars.vue")['default']
export const HomeVoucher: typeof import("../components/home/voucher.vue")['default']
export const LoginNewUserForm: typeof import("../components/login/NewUserForm.vue")['default']
export const LoginOtpInput: typeof import("../components/login/OtpInput.vue")['default']
export const LoginPhoneNumberInput: typeof import("../components/login/PhoneNumberInput.vue")['default']
export const ProductDetailColorSelector: typeof import("../components/productDetail/ColorSelector.vue")['default']
export const ProductDetailEligibleVoucher: typeof import("../components/productDetail/EligibleVoucher.vue")['default']
export const ProductDetailFrequentlyBoughtTogether: typeof import("../components/productDetail/FrequentlyBoughtTogether.vue")['default']
export const ProductDetailHotSelling: typeof import("../components/productDetail/HotSelling.vue")['default']
export const ProductDetailImageGallery: typeof import("../components/productDetail/ImageGallery.vue")['default']
export const ProductDetailSizeGuide: typeof import("../components/productDetail/SizeGuide.vue")['default']
export const ProductDetailT&C: typeof import("../components/productDetail/T&C.vue")['default']
export const ProductDetailWishlistButton: typeof import("../components/productDetail/WishlistButton.vue")['default']
export const ProductDetailPincode: typeof import("../components/productDetail/pincode.vue")['default']
export const ProductDetailReviews&rating: typeof import("../components/productDetail/reviews&rating.vue")['default']
export const ProfileAddressCard: typeof import("../components/profile/AddressCard.vue")['default']
export const ProfilePastOrders: typeof import("../components/profile/PastOrders.vue")['default']
export const ProfileRecentlyViewed: typeof import("../components/profile/ProfileRecentlyViewed.vue")['default']
export const ProfileSavedAddresses: typeof import("../components/profile/SavedAddresses.vue")['default']
export const SearchNoResults: typeof import("../components/search/NoResults.vue")['default']
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
export const LazyTopBar: LazyComponent<typeof import("../components/TopBar.vue")['default']>
export const LazyCartCard: LazyComponent<typeof import("../components/cart/CartCard.vue")['default']>
export const LazyCartEmptyCart: LazyComponent<typeof import("../components/cart/EmptyCart.vue")['default']>
export const LazyCartConfetti: LazyComponent<typeof import("../components/cart/confetti.vue")['default']>
export const LazyCartRelatedProducts: LazyComponent<typeof import("../components/cart/relatedProducts.vue")['default']>
export const LazyCheckoutAddressSelector: LazyComponent<typeof import("../components/checkout/CheckoutAddressSelector.vue")['default']>
export const LazyCollectionAvailableVoucher: LazyComponent<typeof import("../components/collection/AvailableVoucher.vue")['default']>
export const LazyCollectionFilterDrawer: LazyComponent<typeof import("../components/collection/FilterDrawer.vue")['default']>
export const LazyCollectionFilterSidebar: LazyComponent<typeof import("../components/collection/FilterSidebar.vue")['default']>
export const LazyCollectionPage: LazyComponent<typeof import("../components/collection/collectionPage.vue")['default']>
export const LazyCommonFooter: LazyComponent<typeof import("../components/common/Footer.vue")['default']>
export const LazyCommonGlobalNotification: LazyComponent<typeof import("../components/common/GlobalNotification.vue")['default']>
export const LazyCommonGlobalToast: LazyComponent<typeof import("../components/common/GlobalToast.vue")['default']>
export const LazyCommonHeader: LazyComponent<typeof import("../components/common/Header.vue")['default']>
export const LazyCommonHeaderSearch: LazyComponent<typeof import("../components/common/HeaderSearch.vue")['default']>
export const LazyCommonProductCard: LazyComponent<typeof import("../components/common/ProductCard.vue")['default']>
export const LazyCommonProductHorizontalList: LazyComponent<typeof import("../components/common/ProductHorizontalList.vue")['default']>
export const LazyCommonScrollToTopButton: LazyComponent<typeof import("../components/common/ScrollToTopButton.vue")['default']>
export const LazyCommonShareButton: LazyComponent<typeof import("../components/common/ShareButton.vue")['default']>
export const LazyCommonVideoCard: LazyComponent<typeof import("../components/common/VideoCard.vue")['default']>
export const LazyCommonElectricBorder: LazyComponent<typeof import("../components/common/electricBorder.vue")['default']>
export const LazyCommonErrorHandler: LazyComponent<typeof import("../components/common/errorHandler.vue")['default']>
export const LazyHeaderCartIcon: LazyComponent<typeof import("../components/header/CartIcon.vue")['default']>
export const LazyHeaderProfileIcon: LazyComponent<typeof import("../components/header/ProfileIcon.vue")['default']>
export const LazyHeaderWishlistIcon: LazyComponent<typeof import("../components/header/WishlistIcon.vue")['default']>
export const LazyHomeBannerComponent: LazyComponent<typeof import("../components/home/BannerComponent.vue")['default']>
export const LazyHomeCategorySlider: LazyComponent<typeof import("../components/home/CategorySlider.vue")['default']>
export const LazyHomeFitsSection: LazyComponent<typeof import("../components/home/FitsSection.vue")['default']>
export const LazyHomeHeadline: LazyComponent<typeof import("../components/home/Headline.vue")['default']>
export const LazyHomeHeadline2: LazyComponent<typeof import("../components/home/Headline2.vue")['default']>
export const LazyHomeHeroSection: LazyComponent<typeof import("../components/home/HeroSection.vue")['default']>
export const LazyHomeInstaGallery: LazyComponent<typeof import("../components/home/InstaGallery.vue")['default']>
export const LazyHomePremiumCategories: LazyComponent<typeof import("../components/home/PremiumCategories.vue")['default']>
export const LazyHomeRecentlyViewedProducts: LazyComponent<typeof import("../components/home/RecentlyViewedProducts.vue")['default']>
export const LazyHomeShopBy: LazyComponent<typeof import("../components/home/ShopBy.vue")['default']>
export const LazyHomeTrendingProducts: LazyComponent<typeof import("../components/home/TrendingProducts.vue")['default']>
export const LazyHomeVisitStore: LazyComponent<typeof import("../components/home/VisitStore.vue")['default']>
export const LazyHomeStars: LazyComponent<typeof import("../components/home/stars.vue")['default']>
export const LazyHomeVoucher: LazyComponent<typeof import("../components/home/voucher.vue")['default']>
export const LazyLoginNewUserForm: LazyComponent<typeof import("../components/login/NewUserForm.vue")['default']>
export const LazyLoginOtpInput: LazyComponent<typeof import("../components/login/OtpInput.vue")['default']>
export const LazyLoginPhoneNumberInput: LazyComponent<typeof import("../components/login/PhoneNumberInput.vue")['default']>
export const LazyProductDetailColorSelector: LazyComponent<typeof import("../components/productDetail/ColorSelector.vue")['default']>
export const LazyProductDetailEligibleVoucher: LazyComponent<typeof import("../components/productDetail/EligibleVoucher.vue")['default']>
export const LazyProductDetailFrequentlyBoughtTogether: LazyComponent<typeof import("../components/productDetail/FrequentlyBoughtTogether.vue")['default']>
export const LazyProductDetailHotSelling: LazyComponent<typeof import("../components/productDetail/HotSelling.vue")['default']>
export const LazyProductDetailImageGallery: LazyComponent<typeof import("../components/productDetail/ImageGallery.vue")['default']>
export const LazyProductDetailSizeGuide: LazyComponent<typeof import("../components/productDetail/SizeGuide.vue")['default']>
export const LazyProductDetailT&C: LazyComponent<typeof import("../components/productDetail/T&C.vue")['default']>
export const LazyProductDetailWishlistButton: LazyComponent<typeof import("../components/productDetail/WishlistButton.vue")['default']>
export const LazyProductDetailPincode: LazyComponent<typeof import("../components/productDetail/pincode.vue")['default']>
export const LazyProductDetailReviews&rating: LazyComponent<typeof import("../components/productDetail/reviews&rating.vue")['default']>
export const LazyProfileAddressCard: LazyComponent<typeof import("../components/profile/AddressCard.vue")['default']>
export const LazyProfilePastOrders: LazyComponent<typeof import("../components/profile/PastOrders.vue")['default']>
export const LazyProfileRecentlyViewed: LazyComponent<typeof import("../components/profile/ProfileRecentlyViewed.vue")['default']>
export const LazyProfileSavedAddresses: LazyComponent<typeof import("../components/profile/SavedAddresses.vue")['default']>
export const LazySearchNoResults: LazyComponent<typeof import("../components/search/NoResults.vue")['default']>
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
