
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
      'TopBar': typeof import("../../components/TopBar.vue")['default']
    'CartCard': typeof import("../../components/cart/CartCard.vue")['default']
    'CartEmptyCart': typeof import("../../components/cart/EmptyCart.vue")['default']
    'CartConfetti': typeof import("../../components/cart/confetti.vue")['default']
    'CartRelatedProducts': typeof import("../../components/cart/relatedProducts.vue")['default']
    'CheckoutAddressSelector': typeof import("../../components/checkout/CheckoutAddressSelector.vue")['default']
    'CollectionAvailableVoucher': typeof import("../../components/collection/AvailableVoucher.vue")['default']
    'CollectionFilterDrawer': typeof import("../../components/collection/FilterDrawer.vue")['default']
    'CollectionFilterSidebar': typeof import("../../components/collection/FilterSidebar.vue")['default']
    'CollectionPage': typeof import("../../components/collection/collectionPage.vue")['default']
    'CommonFooter': typeof import("../../components/common/Footer.vue")['default']
    'CommonGlobalNotification': typeof import("../../components/common/GlobalNotification.vue")['default']
    'CommonGlobalToast': typeof import("../../components/common/GlobalToast.vue")['default']
    'CommonHeader': typeof import("../../components/common/Header.vue")['default']
    'CommonHeaderSearch': typeof import("../../components/common/HeaderSearch.vue")['default']
    'CommonProductCard': typeof import("../../components/common/ProductCard.vue")['default']
    'CommonProductHorizontalList': typeof import("../../components/common/ProductHorizontalList.vue")['default']
    'CommonScrollToTopButton': typeof import("../../components/common/ScrollToTopButton.vue")['default']
    'CommonShareButton': typeof import("../../components/common/ShareButton.vue")['default']
    'CommonVideoCard': typeof import("../../components/common/VideoCard.vue")['default']
    'CommonElectricBorder': typeof import("../../components/common/electricBorder.vue")['default']
    'CommonErrorHandler': typeof import("../../components/common/errorHandler.vue")['default']
    'HeaderWishlistIcon': typeof import("../../components/header/WishlistIcon.vue")['default']
    'HomeBannerComponent': typeof import("../../components/home/BannerComponent.vue")['default']
    'HomeCategorySlider': typeof import("../../components/home/CategorySlider.vue")['default']
    'HomeFitsSection': typeof import("../../components/home/FitsSection.vue")['default']
    'HomeHeadline': typeof import("../../components/home/Headline.vue")['default']
    'HomeHeadline2': typeof import("../../components/home/Headline2.vue")['default']
    'HomeHeroSection': typeof import("../../components/home/HeroSection.vue")['default']
    'HomeInstaGallery': typeof import("../../components/home/InstaGallery.vue")['default']
    'HomePremiumCategories': typeof import("../../components/home/PremiumCategories.vue")['default']
    'HomeRecentlyViewedProducts': typeof import("../../components/home/RecentlyViewedProducts.vue")['default']
    'HomeShopBy': typeof import("../../components/home/ShopBy.vue")['default']
    'HomeTrendingProducts': typeof import("../../components/home/TrendingProducts.vue")['default']
    'HomeVisitStore': typeof import("../../components/home/VisitStore.vue")['default']
    'HomeStars': typeof import("../../components/home/stars.vue")['default']
    'LoginNewUserForm': typeof import("../../components/login/NewUserForm.vue")['default']
    'LoginOtpInput': typeof import("../../components/login/OtpInput.vue")['default']
    'LoginPhoneNumberInput': typeof import("../../components/login/PhoneNumberInput.vue")['default']
    'ProductDetailEligibleVoucher': typeof import("../../components/productDetail/EligibleVoucher.vue")['default']
    'ProductDetailFrequentlyBoughtTogether': typeof import("../../components/productDetail/FrequentlyBoughtTogether.vue")['default']
    'ProductDetailHotSelling': typeof import("../../components/productDetail/HotSelling.vue")['default']
    'ProductDetailImageGallery': typeof import("../../components/productDetail/ImageGallery.vue")['default']
    'ProductDetailSizeGuide': typeof import("../../components/productDetail/SizeGuide.vue")['default']
    'ProductDetailT&C': typeof import("../../components/productDetail/T&C.vue")['default']
    'ProductDetailWishlistButton': typeof import("../../components/productDetail/WishlistButton.vue")['default']
    'ProductDetailPincode': typeof import("../../components/productDetail/pincode.vue")['default']
    'ProductDetailReviews&rating': typeof import("../../components/productDetail/reviews&rating.vue")['default']
    'ProfileAddressCard': typeof import("../../components/profile/AddressCard.vue")['default']
    'ProfilePastOrders': typeof import("../../components/profile/PastOrders.vue")['default']
    'ProfileRecentlyViewed': typeof import("../../components/profile/ProfileRecentlyViewed.vue")['default']
    'ProfileSavedAddresses': typeof import("../../components/profile/SavedAddresses.vue")['default']
    'SearchNoResults': typeof import("../../components/search/NoResults.vue")['default']
    'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyTopBar': LazyComponent<typeof import("../../components/TopBar.vue")['default']>
    'LazyCartCard': LazyComponent<typeof import("../../components/cart/CartCard.vue")['default']>
    'LazyCartEmptyCart': LazyComponent<typeof import("../../components/cart/EmptyCart.vue")['default']>
    'LazyCartConfetti': LazyComponent<typeof import("../../components/cart/confetti.vue")['default']>
    'LazyCartRelatedProducts': LazyComponent<typeof import("../../components/cart/relatedProducts.vue")['default']>
    'LazyCheckoutAddressSelector': LazyComponent<typeof import("../../components/checkout/CheckoutAddressSelector.vue")['default']>
    'LazyCollectionAvailableVoucher': LazyComponent<typeof import("../../components/collection/AvailableVoucher.vue")['default']>
    'LazyCollectionFilterDrawer': LazyComponent<typeof import("../../components/collection/FilterDrawer.vue")['default']>
    'LazyCollectionFilterSidebar': LazyComponent<typeof import("../../components/collection/FilterSidebar.vue")['default']>
    'LazyCollectionPage': LazyComponent<typeof import("../../components/collection/collectionPage.vue")['default']>
    'LazyCommonFooter': LazyComponent<typeof import("../../components/common/Footer.vue")['default']>
    'LazyCommonGlobalNotification': LazyComponent<typeof import("../../components/common/GlobalNotification.vue")['default']>
    'LazyCommonGlobalToast': LazyComponent<typeof import("../../components/common/GlobalToast.vue")['default']>
    'LazyCommonHeader': LazyComponent<typeof import("../../components/common/Header.vue")['default']>
    'LazyCommonHeaderSearch': LazyComponent<typeof import("../../components/common/HeaderSearch.vue")['default']>
    'LazyCommonProductCard': LazyComponent<typeof import("../../components/common/ProductCard.vue")['default']>
    'LazyCommonProductHorizontalList': LazyComponent<typeof import("../../components/common/ProductHorizontalList.vue")['default']>
    'LazyCommonScrollToTopButton': LazyComponent<typeof import("../../components/common/ScrollToTopButton.vue")['default']>
    'LazyCommonShareButton': LazyComponent<typeof import("../../components/common/ShareButton.vue")['default']>
    'LazyCommonVideoCard': LazyComponent<typeof import("../../components/common/VideoCard.vue")['default']>
    'LazyCommonElectricBorder': LazyComponent<typeof import("../../components/common/electricBorder.vue")['default']>
    'LazyCommonErrorHandler': LazyComponent<typeof import("../../components/common/errorHandler.vue")['default']>
    'LazyHeaderWishlistIcon': LazyComponent<typeof import("../../components/header/WishlistIcon.vue")['default']>
    'LazyHomeBannerComponent': LazyComponent<typeof import("../../components/home/BannerComponent.vue")['default']>
    'LazyHomeCategorySlider': LazyComponent<typeof import("../../components/home/CategorySlider.vue")['default']>
    'LazyHomeFitsSection': LazyComponent<typeof import("../../components/home/FitsSection.vue")['default']>
    'LazyHomeHeadline': LazyComponent<typeof import("../../components/home/Headline.vue")['default']>
    'LazyHomeHeadline2': LazyComponent<typeof import("../../components/home/Headline2.vue")['default']>
    'LazyHomeHeroSection': LazyComponent<typeof import("../../components/home/HeroSection.vue")['default']>
    'LazyHomeInstaGallery': LazyComponent<typeof import("../../components/home/InstaGallery.vue")['default']>
    'LazyHomePremiumCategories': LazyComponent<typeof import("../../components/home/PremiumCategories.vue")['default']>
    'LazyHomeRecentlyViewedProducts': LazyComponent<typeof import("../../components/home/RecentlyViewedProducts.vue")['default']>
    'LazyHomeShopBy': LazyComponent<typeof import("../../components/home/ShopBy.vue")['default']>
    'LazyHomeTrendingProducts': LazyComponent<typeof import("../../components/home/TrendingProducts.vue")['default']>
    'LazyHomeVisitStore': LazyComponent<typeof import("../../components/home/VisitStore.vue")['default']>
    'LazyHomeStars': LazyComponent<typeof import("../../components/home/stars.vue")['default']>
    'LazyLoginNewUserForm': LazyComponent<typeof import("../../components/login/NewUserForm.vue")['default']>
    'LazyLoginOtpInput': LazyComponent<typeof import("../../components/login/OtpInput.vue")['default']>
    'LazyLoginPhoneNumberInput': LazyComponent<typeof import("../../components/login/PhoneNumberInput.vue")['default']>
    'LazyProductDetailEligibleVoucher': LazyComponent<typeof import("../../components/productDetail/EligibleVoucher.vue")['default']>
    'LazyProductDetailFrequentlyBoughtTogether': LazyComponent<typeof import("../../components/productDetail/FrequentlyBoughtTogether.vue")['default']>
    'LazyProductDetailHotSelling': LazyComponent<typeof import("../../components/productDetail/HotSelling.vue")['default']>
    'LazyProductDetailImageGallery': LazyComponent<typeof import("../../components/productDetail/ImageGallery.vue")['default']>
    'LazyProductDetailSizeGuide': LazyComponent<typeof import("../../components/productDetail/SizeGuide.vue")['default']>
    'LazyProductDetailT&C': LazyComponent<typeof import("../../components/productDetail/T&C.vue")['default']>
    'LazyProductDetailWishlistButton': LazyComponent<typeof import("../../components/productDetail/WishlistButton.vue")['default']>
    'LazyProductDetailPincode': LazyComponent<typeof import("../../components/productDetail/pincode.vue")['default']>
    'LazyProductDetailReviews&rating': LazyComponent<typeof import("../../components/productDetail/reviews&rating.vue")['default']>
    'LazyProfileAddressCard': LazyComponent<typeof import("../../components/profile/AddressCard.vue")['default']>
    'LazyProfilePastOrders': LazyComponent<typeof import("../../components/profile/PastOrders.vue")['default']>
    'LazyProfileRecentlyViewed': LazyComponent<typeof import("../../components/profile/ProfileRecentlyViewed.vue")['default']>
    'LazyProfileSavedAddresses': LazyComponent<typeof import("../../components/profile/SavedAddresses.vue")['default']>
    'LazySearchNoResults': LazyComponent<typeof import("../../components/search/NoResults.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
