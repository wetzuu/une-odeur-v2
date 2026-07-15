import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PerfumeCard from '../components/PerfumeCard'
import ShelfSection from '../components/ShelfSection'
import { getFragrances } from '../lib/fragranceService'
import { SCENT_FAMILIES } from '../lib/catalog'

const categoryOptions = ['All', ...SCENT_FAMILIES]

export default function CategoryPage() {
	const [fragrances, setFragrances] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [activeBrand, setActiveBrand] = useState('All brands')
	const [searchParams, setSearchParams] = useSearchParams()

	const familyParam = searchParams.get('family')
	const activeCategory = categoryOptions.includes(familyParam) ? familyParam : 'All'

	function setActiveCategory(category) {
		setSearchParams(category === 'All' ? {} : { family: category })
	}

	useEffect(() => {
		let isMounted = true

		getFragrances()
			.then((data) => {
				if (isMounted) setFragrances(data)
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
		return fragrances.filter((frag) => {
			const matchesCategory =
				activeCategory === 'All' ||
				(frag.tags ?? []).some((tag) => tag.toLowerCase() === activeCategory.toLowerCase())

			const matchesBrand = activeBrand === 'All brands' || frag.brand === activeBrand

			return matchesCategory && matchesBrand
		})
	}, [fragrances, activeCategory, activeBrand])

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

					{brandShelves.length > 0 ? (
						brandShelves.map(([brand, frags]) => (
							<div key={brand} className="brand-shelf">
								<ShelfSection
									title={brand}
									note={`${frags.length} ${frags.length === 1 ? 'ITEM' : 'ITEMS'}`}
								>
									<div className="shelf-grid">
										{frags.map((frag) => (
											<PerfumeCard key={frag.id} frag={frag} />
										))}
									</div>
								</ShelfSection>
							</div>
						))
					) : (
						<p className="print-note">THIS SHELF IS EMPTY — TRY ANOTHER COMBINATION</p>
					)}
				</>
			)}
		</div>
	)
}
