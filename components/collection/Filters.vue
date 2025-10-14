<template>
  <div class="filters-container">
    <!-- Header -->
    <div class="filters-header bg-black">
      <h2>Filters</h2>
      
    </div>

    <!-- Selected Chips (Sizes first) -->
    <div v-if="catsArr.length || subsArr.length || sizesArr.length" class="selected-filters">
      <div v-for="z in sizesArr" :key="'z-'+z" class="selected-chip" @click="removeSize(z)">
        {{ capSize(z) }} ×
      </div>
      <div v-for="c in catsArr" :key="'c-'+c" class="selected-chip" @click="removeCat(c)">
        {{ cap(c) }} ×
      </div>
      <div v-for="s in subsArr" :key="'s-'+s" class="selected-chip" @click="removeSub(s)">
        {{ cap(s) }} ×
      </div>
    </div>

    <!-- Filter Groups (Sizes on top) -->
    <div v-for="group in orderedGroups" :key="group.key" class="filter-card">
      <div class="filter-header" @click="toggle(group.key)">
        <span>{{ cap(group.key) }}</span>
        <ArrowDownIcon :class="['arrow', open[group.key] && 'open']" />
      </div>
      <transition name="slide-fade">
        <div v-show="open[group.key]" class="filter-content">
          <button
            v-for="f in sorted(group.items, group.key)"
            :key="f.name || f"
            class="filter-btn"
            :class="{
              selected: group.key.toLowerCase() === 'sizes'
                ? sizeSet.has(f.name || f)
                : catSet.has(f.name || f)
            }"
            @click="group.key.toLowerCase() === 'sizes'
              ? toggleSize(f.name || f)
              : toggleCat(f.name || f)"
          >
            <span
              v-if="group.key.toLowerCase() === 'color'"
              class="color-box"
              :style="{ background: (f.name || f).toLowerCase() }"
            ></span>
            {{ group.key.toLowerCase() === 'sizes'
              ? capSize(f.name || f)
              : cap(f.name || f) }}
          </button>
        </div>
      </transition>
    </div>

    <!-- Subcategories -->
    <div v-if="subs.length" class="filter-card">
      <div class="filter-header" @click="toggle('subs')">
        <span>Subcategories</span>
        <ArrowDownIcon :class="['arrow', open.subs && 'open']" />
      </div>
      <transition name="slide-fade">
        <div v-show="open.subs" class="filter-content">
          <button
            v-for="s in sorted(subs)"
            :key="s"
            class="filter-btn"
            :class="{ selected: subSet.has(s) }"
            @click="toggleSub(s)"
          >
            {{ cap(s) }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ArrowDownIcon } from 'lucide-vue-next'

const props = defineProps({
  categoryNumber: Number,
  selectedCategories: { type: Array, default: () => [] },
  selectedTags: { type: Array, default: () => [] },
  selectedSizes: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'update:selectedCategories',
  'update:selectedTags',
  'update:selectedSizes',
  'closeFilters'
])

// State
const grouped = ref({})
const subs = ref([])
const sizes = ref([])
const open = reactive({ subs: true, sizes: true })

// Local sets
const catSet = reactive(new Set())
const subSet = reactive(new Set())
const sizeSet = reactive(new Set())

// Sync props to local sets
const syncSet = (set, arr = []) => { set.clear?.(); arr.forEach(v => set.add(v)) }
watch(() => props.selectedCategories, v => syncSet(catSet, v), { immediate: true })
watch(() => props.selectedTags, v => syncSet(subSet, v), { immediate: true })
watch(() => props.selectedSizes, v => syncSet(sizeSet, v), { immediate: true })

const catsArr = computed(() => Array.from(catSet))
const subsArr = computed(() => Array.from(subSet))
const sizesArr = computed(() => Array.from(sizeSet))

// Helpers
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
const capSize = s => {
  if (!s) return ''
  const match = s.match(/^(\d*)([a-zA-Z]+)$/)
  if (match) return (match[1] || '') + (match[2] || '').toUpperCase()
  return s.toUpperCase()
}

const toggle = k => (open[k] = !open[k])

// Emit updates
const emitCats = () => emit('update:selectedCategories', Array.from(catSet))
const emitSubs = () => emit('update:selectedTags', Array.from(subSet))
const emitSizes = () => emit('update:selectedSizes', Array.from(sizeSet))

// Toggle handlers
const toggleCat = name => { catSet.has(name) ? catSet.delete(name) : catSet.add(name); emitCats() }
const toggleSub = name => { subSet.has(name) ? subSet.delete(name) : subSet.add(name); emitSubs() }
const toggleSize = name => { sizeSet.has(name) ? sizeSet.delete(name) : sizeSet.add(name); emitSizes() }

const removeCat = c => { catSet.delete(c); emitCats() }
const removeSub = s => { subSet.delete(s); emitSubs() }
const removeSize = z => { sizeSet.delete(z); emitSizes() }

const sorted = (arr = [], group) => {
  const key = group?.toLowerCase()
  const set =
    key === 'sizes' ? sizeSet
    : key === 'color' ? catSet
    : catSet
  return [...arr].sort((a, b) =>
    (set.has(a.name || a) ? -1 : 0) - (set.has(b.name || b) ? -1 : 0)
  )
}

const orderedGroups = computed(() => {
  const groupsArr = []
  if (sizes.value.length) groupsArr.push({ key: 'Sizes', items: sizes.value })
  for (const key in grouped.value) groupsArr.push({ key, items: grouped.value[key] })
  return groupsArr
})

// Fetch filters
const fetchFilters = async () => {
  try {
    const res = await fetch(
      `https://api.streetstylestore.com/collections/sss_config/documents/category-${props.categoryNumber}`,
      { headers: { 'x-typesense-api-key': 'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx' } }
    )
    const j = await res.json()
    const data = JSON.parse(j.data || '{}')

    grouped.value = data.new_filter_tags || {}

    subs.value = Array.isArray(data.sub_categories)
      ? data.sub_categories
      : (data.sub_categories || '')
          .split(',')
          .map(x => x.trim())
          .filter(Boolean)

    sizes.value = data.category_sizes
      ? data.category_sizes.split('*').map(x => x.trim()).filter(Boolean)
      : []

    if (Array.isArray(data.related_tags) && data.related_tags.length) {
      grouped.value['Related'] = data.related_tags.map(t => ({ name: t.name }))
    }
  } catch (e) {
    console.error('fetchFilters error', e)
  }
}

onMounted(fetchFilters)
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: .8rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
  background: #fff;
}

.filters-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #000;
  letter-spacing: 0.3px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #000;
  cursor: pointer;
  transition: 0.2s;
  line-height: 1;
}

.close-btn:hover {
  color: #e11d48;
  transform: scale(1.1);
}

.filter-card {
  background: #fff;
  border-radius: .75rem;
  box-shadow: 0 3px 8px #0002;
  overflow: hidden;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  padding: .7rem 1rem;
  background: #000;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  font-size: .875rem;
}

.filter-content {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  padding: .7rem 1rem;
}

.filter-btn {
  border: 1px solid #ccc;
  padding: .35rem .6rem;
  border-radius: .5rem;
  font-size: .85rem;
  cursor: pointer;
  background: #fff;
  display: flex;
  align-items: center;
  gap: .3rem;
  transition: .2s;
}
.filter-btn.selected {
  background: #000;
  color: #fff;
  border-color: #000;
}
.color-box {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-right: .35rem;
  display: inline-block;
}
.selected-filters {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  padding: 0 1rem;
}
.selected-chip {
  background: #000;
  color: #fff;
  padding: .35rem .65rem;
  border-radius: .5rem;
  cursor: pointer;
  font-size: .8rem;
  transition: .2s;
}
.selected-chip:hover { background: #333; }
.arrow { width: 18px; transition: transform .3s; }
.arrow.open { transform: rotate(180deg); }
.slide-fade-enter-active, .slide-fade-leave-active { transition: .25s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
