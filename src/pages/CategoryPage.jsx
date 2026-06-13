import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PerfumeCard from '../components/PerfumeCard'
import fragrances from '../data/fragrances'

const categoryOptions = [
	'All',
	'Fresh',
	'Woody',
	'Floral',
	'Amber',
	'Sweet',
	'Spicy',
	'Citrus',
	'Fruity',
	'Gourmand',
	'Musk',
]

const brandOptions = [
	'All brands',
	...new Set(fragrances.map((frag) => frag.brand)),
]

export default function CategoryPage() {
	const [activeCategory, setActiveCategory] = useState('All')
	const [activeBrand, setActiveBrand] = useState('All brands')

	const visibleFragrances = useMemo(() => {
		return fragrances.filter((frag) => {
			const matchesCategory =
				activeCategory === 'All' ||
				frag.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase())

			const matchesBrand = activeBrand === 'All brands' || frag.brand === activeBrand

			return matchesCategory && matchesBrand
		})
	}, [activeCategory, activeBrand])

	return (
		<div className="category-page">
			<section className="category-hero">
				<div>
					<p className="category-kicker">Browse by category</p>
					<h1>Choose a scent family to filter through.</h1>
					<p className="category-copy">
						Use da buttons to filter out which scent family you wanna see, and use dropdown box to filter by brand.
					</p>
				</div>

				<div className="category-controls">
					<div className="category-pills">
						{categoryOptions.map((category) => (
							<button
								key={category}
								type="button"
								className={`category-pill ${activeCategory === category ? 'active' : ''}`}
								onClick={() => setActiveCategory(category)}
							>
								{category}
							</button>
						))}
					</div>

					<label className="category-select-wrap">
						<span>Brand</span>
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

			<section className="category-results">
				<div className="category-results-header">
					<h2>{activeCategory === 'All' ? 'All Fragrances' : activeCategory}</h2>
					<Link to="/" className="category-back-link">
						Back to home
					</Link>
				</div>

				<div className="fragrance-grid category-grid">
					{visibleFragrances.length > 0 ? (
						visibleFragrances.map((frag) => <PerfumeCard key={frag.id} frag={frag} />)
					) : (
						<p className="search-empty-state">No fragrances match this combination.</p>
					)}
				</div>
			</section>
		</div>
	)
}
