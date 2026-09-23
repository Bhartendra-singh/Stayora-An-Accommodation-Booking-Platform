import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { cities } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const HotelProfile = () => {
  const { axios, getToken } = useAppContext()
  const { isLoaded, isSignedIn } = useUser()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  const [hotel, setHotel] = useState(null)
  const [form, setForm] = useState({
    name: '',
    contact: '',
    address: '',
    city: '',
  })

  const fetchHotel = async () => {
    try {
      const { data } = await axios.get('/api/hotels/me', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setHotel(data.hotel)
        setForm({
          name: data.hotel.name || '',
          contact: data.hotel.contact || '',
          address: data.hotel.address || '',
          city: data.hotel.city || '',
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Wait for Clerk to finish loading the session before calling protected APIs —
    // calling too early sends no token and the backend rejects it.
    if (!isLoaded) return
    if (!isSignedIn) {
      setLoading(false)
      return
    }
    fetchHotel()
  }, [isLoaded, isSignedIn])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!form.name || !form.contact || !form.address || !form.city) {
      toast.error('Please fill in all the details')
      return
    }

    setSaving(true)
    try {
      const { data } = await axios.put('/api/hotels/me', form, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success(data.message || 'Hotel details updated')
        setHotel(data.hotel)
        setEditing(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-gray-500 mt-10">Loading hotel details...</p>
  }

  if (!hotel) {
    return <p className="text-gray-500 mt-10">No hotel found for this account.</p>
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="My Hotel"
        subTitle="View and update your hotel's information. These details are shown to guests browsing your rooms."
      />

      <div className="mt-8 max-w-lg">
        {!editing ? (
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Hotel Name</p>
              <p className="text-gray-800 text-lg">{hotel.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
              <p className="text-gray-800">{hotel.contact}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
              <p className="text-gray-800">{hotel.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">City</p>
              <p className="text-gray-800">{hotel.city}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="bg-primary text-white px-6 py-2 rounded mt-2"
            >
              Edit Details
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmitHandler} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className="text-gray-800 text-sm">Hotel Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm">Phone</label>
              <input
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm">Address</label>
              <input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm">City</label>
              <select
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="border border-gray-300 rounded w-full px-3 py-2 mt-1"
                required
              >
                <option value="">Select City</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {!cities.includes(form.city) && form.city && (
                  <option value={form.city}>{form.city}</option>
                )}
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setForm({
                    name: hotel.name,
                    contact: hotel.contact,
                    address: hotel.address,
                    city: hotel.city,
                  })
                }}
                className="border border-gray-300 text-gray-600 px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default HotelProfile