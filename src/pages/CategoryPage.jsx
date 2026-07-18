import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PerfumeCard from '../components/PerfumeCard'
import ShelfSection from '../components/ShelfSection'
import { getFragrances } from '../lib/fragranceService'
import { getRatingSummaries } from '../lib/ratingService'
import { SCENT_FAMILIES } from '../lib/catalog'

const categoryOptions = ['All', ...SCENT_FAMILIES]

export default function CategoryPage() {
	const [fragrances, setFragrances] = useState([])
	const [ratings, setRatings] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [activeBrand, setActiveBrand] = useState('All brands')
	const [sortBy, setSortBy] = useState('newest')
	const [searchParams, setSearchParams] = useSearchParams()

	const familyParam = searchParams.get('family')
	const activeCategory = categoryOptions.includes(familyParam) ? familyParam : 'All'

	function setActiveCategory(category) {
		setSearchParams(category === 'All' ? {} : { family: category })
	}

	useEffect(() => {
		let isMounted = true

		// Ratings fail soft — the shelves still render without them.
		Promise.all([getFragrances(), getRatingSummaries().catch(() => ({}))])
			.then(([data, summaries]) => {
				if (isMounted) {
					setFragrances(data)
					setRatings(summaries)
				}
			})
			.catch((err) => {
				if (isMounted) setError(err.message)
			})
			.finally(() => {
				if (isMounted) setLoading(false)
			})

		return () => {
			isMounted = false
		}
	}, [])

	const brandOptions = useMemo(
		() => ['All brands', ...new Set(fragrances.map((frag) => frag.brand))],
		[fragrances]
	)

	const visibleFragrances = useMemo(() => {
		const filtered = fragrances.filter((frag) => {
			const matchesCategory =
				activeCategory === 'All' ||
				(frag.tags ?? []).some((tag) => tag.toLowerCase() === activeCategory.toLowerCase())

			const matchesBrand = activeBrand === 'All brands' || frag.brand === activeBrand

			return matchesCategory && matchesBrand
		})

		// 'newest' keeps the service's created_at ordering. Untested
		// longevity (null) always sinks to the bottom.
		if (sortBy === 'longevity-desc') {
			filtered.sort((a, b) => (b.longevity_hours ?? -1) - (a.longevity_hours ?? -1))
		} else if (sortBy === 'longevity-asc') {
			filtered.sort((a, b) => (a.longevity_hours ?? Infinity) - (b.longevity_hours ?? Infinity))
		}

		return filtered
	}, [fragrances, activeCategory, activeBrand, sortBy])

	// Each brand gets its own run of shelving, like walking a stocked aisle.
	const brandShelves = useMemo(() => {
		const shelves = new Map()
		for (const frag of visibleFragrances) {
			if (!shelves.has(frag.brand)) shelves.set(frag.brand, [])
			shelves.get(frag.brand).push(frag)
		}
		return [...shelves.entries()]
	}, [visibleFragrances])

	return (
		<div className="aisles-page">
			<section className="aisles-hero">
				<p className="aisles-kicker">Walk the aisles</p>
				<h1>Every shelf is sorted by scent family.</h1>
				<p className="aisles-copy">
					Pick a family from the labels below, or browse a single brand's shelf.
					Take your time — nobody's waiting behind you.
				</p>

				<div className="aisles-controls">
					<div className="aisle-pills" role="group" aria-label="Scent families">
						{categoryOptions.map((category, index) => (
							<button
								key={category}
								type="button"
								className={`shelf-label ${activeCategory === category ? 'active' : ''}`}
								onClick={() => setActiveCategory(category)}
							>
								{category !== 'All' && (
									<span className="family-index">{String(index).padStart(2, '0')}</span>
								)}
								{category}
							</button>
						))}
					</div>

					<div className="select-row">
						<label className="brand-select-wrap">
							<span>Brand shelf</span>
							<select value={activeBrand} onChange={(event) => setActiveBrand(event.target.value)}>
								{brandOptions.map((brand) => (
									<option key={brand} value={brand}>
										{brand}
									</option>
								))}
							</select>
						</label>

						<label className="brand-select-wrap">
							<span>Sort the shelf</span>
							<select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
								<option value="newest">Newest first</option>
								<option value="longevity-desc">Longevity — longest first</option>
								<option value="longevity-asc">Longevity — shortest first</option>
							</select>
						</label>
					</div>
				</div>
			</section>

			{loading ? (
				<p className="print-note">PRINTING THE SHELVES…</p>
			) : error ? (
				<p className="print-note">COULDN'T STOCK THE SHELVES: {error}</p>
			) : (
				<>
					<p className="aisles-count">
						{visibleFragrances.length} {visibleFragrances.length === 1 ? 'ITEM' : 'ITEMS'} ON THE
						SHELF
						{activeCategory !== 'All' && ` · FAMILY: ${activeCategory.toUpperCase()}`}
						{activeBrand !== 'All brands' && ` · BRAND: ${activeBrand.toUpperCase()}`}
					</p>

					{visibleFragrances.length > 0 && sortBy !== 'newest' ? (
						<ShelfSection
							title="Sorted by longevity"
							note={sortBy === 'longevity-desc' ? 'LONGEST WEAR FIRST' : 'SHORTEST WEAR FIRST'}
						>
							<div className="shelf-grid">
								{visibleFragrances.map((frag) => (
									<PerfumeCard key={frag.id} frag={frag} rating={ratings[frag.id]} />
								))}
							</div>
						</ShelfSection>
					) : brandShelves.length > 0 ? (
						brandShelves.map(([brand, frags]) => (
							<div key={brand} className="brand-shelf">
								<ShelfSection
									title={brand}
									note={`${frags.length} ${frags.length === 1 ? 'ITEM' : 'ITEMS'}`}
								>
									<div className="shelf-grid">
										{frags.map((frag) => (
											<PerfumeCard key={frag.id} frag={frag} rating={ratings[frag.id]} />
										))}
									</div>
								</ShelfSection>
							</div>
						))
					) : (
						<p className="print-note">THIS SHELF IS EMPTY — TRY ANOTHER COMBINATION</p>
					)}

					<Link to="/stockroom/new" className="stock-invite">
						<span className="stock-invite-plus">+</span>
						MISSING SOMETHING? STOCK A NEW ITEM IN THE STOCKROOM
					</Link>
				</>
			)}
		</div>
	)
}
