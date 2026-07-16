import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FragranceForm from '../components/FragranceForm'
import { addFragrance, getFragrance, updateFragrance } from '../lib/fragranceService'
import { inventoryNumber, slugify } from '../lib/catalog'

// NOTE: catalog management is intentionally open to every visitor at this
// stage. When authentication/ownership lands, gate this page and the
// stockroom strip on FragPage — the data calls in fragranceService and
// the form itself won't need to change.
export default function StockFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [missing, setMissing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    if (!isEdit) {
      setInitial(null)
      setMissing(false)
      setLoading(false)
      return undefined
    }

    let isMounted = true
    setLoading(true)
    setMissing(false)

    getFragrance(id)
      .then((data) => {
        if (isMounted) setInitial(data)
      })
      .catch(() => {
        if (isMounted) setMissing(true)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id, isEdit])

  async function createWithUniqueId(values) {
    const base = slugify(values.name)
    try {
      return await addFragrance({ ...values, id: base })
    } catch (error) {
      // Slug collision with an existing item — retry once with a suffix.
      if (String(error.message).toLowerCase().includes('duplicate')) {
        const suffix = Math.random().toString(36).slice(2, 6)
        return addFragrance({ ...values, id: `${base}-${suffix}` })
      }
      throw error
    }
  }

  async function handleSubmit(values) {
    setBusy(true)
    setServerError(null)
    try {
      if (isEdit) {
        await updateFragrance(id, values)
        navigate(`/frags/${id}`)
      } else {
        const saved = await createWithUniqueId(values)
        navigate(`/frags/${saved.id}`)
      }
    } catch (error) {
      setServerError(error.message)
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="void-slip">
        <p className="print-note">PULLING THE PAPERWORK…</p>
      </div>
    )
  }

  if (missing) {
    return (
      <div className="void-slip">
        <div className="receipt-wrap">
          <div className="receipt">
            <p className="receipt-shop">UNE ’ODEUR</p>
            <div className="receipt-rule" />
            <p className="receipt-sub">NO INTAKE FORM ON FILE FOR THIS ITEM</p>
            <div>
              <span className="void-stamp">VOID</span>
            </div>
            <div className="receipt-rule" />
            <p className="receipt-sub">
              <Link to="/">← BACK TO THE SHOP FLOOR</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="intake-page">
      <div className="intake-card">
        <p className="aisles-kicker">The Stockroom</p>
        <h1 className="intake-title">{isEdit ? 'Update an item' : 'Stock a new item'}</h1>
        <p className="intake-sub">
          {isEdit
            ? `INTAKE FORM Nº ${inventoryNumber(id)} — CORRECTIONS IN INK, PLEASE`
            : 'INTAKE FORM — FILL EVERYTHING IN BEFORE IT GOES ON THE SHELF'}
        </p>

        <FragranceForm
          key={initial?.id ?? 'new'}
          initial={initial}
          submitLabel={isEdit ? 'File the correction' : 'Put it on the shelf'}
          busy={busy}
          serverError={serverError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEdit ? `/frags/${id}` : '/')}
        />
      </div>
    </div>
  )
}
