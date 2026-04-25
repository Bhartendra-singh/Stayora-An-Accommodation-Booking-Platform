import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {

  const { axios, getToken } = useAppContext()

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    amenities: {
      'Free Wifi': false,
      'Room Service': false,
      'Free Breakfast': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })

  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    // validation
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !Object.values(inputs.amenities).some(v => v) ||
      !Object.values(images).some(img => img)
    ) {
      toast.error("Please fill in all the details")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("roomType", inputs.roomType)
      formData.append("pricePerNight", inputs.pricePerNight)

      const selectedAmenities = Object.keys(inputs.amenities)
        .filter(key => inputs.amenities[key])

      formData.append("amenities", JSON.stringify(selectedAmenities))

      Object.values(images).forEach(img => {
        if (img) formData.append("images", img)
      })

      const { data } = await axios.post(
        "/api/rooms",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if (data.success) {
        toast.success(data.message || "Room added successfully")

        setInputs({
          roomType: '',
          pricePerNight: '',
          amenities: {
            'Free Wifi': false,
            'Room Service': false,
            'Free Breakfast': false,
            'Mountain View': false,
            'Pool Access': false
          }
        })

        setImages({ 1: null, 2: null, 3: null, 4: null })
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience"
      />

      <p className="text-gray-800 mt-10">Images</p>

      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map(key => (
          <label key={key}>
            <img
              className="max-h-16 cursor-pointer opacity-80"
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
            className="border border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={e =>
              setInputs({ ...inputs, pricePerNight: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>

      <div className="flex flex-col mt-1 text-gray-400 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity]
                  }
                })
              }
            />
            <span className="ml-2">{amenity}</span>
          </label>
        ))}
      </div>

      <button
        className="bg-primary text-white px-8 py-2 rounded mt-8"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Room"}
      </button>
    </form>
  )
}

export default AddRoom