"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    platform: "FiveM",
    published: false,
    featured: false,
    newRelease: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      // Upload image
      // Upload zip
      // Insert into products table
      // Redirect back to /admin/products

      console.log(form);
      console.log(image);
      console.log(zipFile);

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fff",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 34,
            marginBottom: 8,
          }}
        >
          New Product
        </h1>

        <p
          style={{
            color: "#888",
            marginBottom: 40,
          }}
        >
          Create a new marketplace product.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={input}
          />

          <textarea
            placeholder="Description"
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            style={{
              ...input,
              resize: "vertical",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              style={input}
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              style={input}
            />
          </div>

          <select
            value={form.platform}
            onChange={(e) =>
              setForm({
                ...form,
                platform: e.target.value,
              })
            }
            style={input}
          >
            <option>FiveM</option>
            <option>IMVU</option>
            <option>Website</option>
            <option>Second Life</option>
            <option>Roblox</option>
          </select>

          <div>
            <label>Preview Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] ?? null)
              }
            />
          </div>

          <div>
            <label>ZIP File</label>

            <input
              type="file"
              accept=".zip"
              onChange={(e) =>
                setZipFile(e.target.files?.[0] ?? null)
              }
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({
                  ...form,
                  published: e.target.checked,
                })
              }
            />

            {" "}Published
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({
                  ...form,
                  featured: e.target.checked,
                })
              }
            />

            {" "}Featured
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.newRelease}
              onChange={(e) =>
                setForm({
                  ...form,
                  newRelease: e.target.checked,
                })
              }
            />

            {" "}New Release
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#ec4899",
              color: "#fff",
              border: 0,
              padding: 16,
              borderRadius: 10,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Saving..." : "Publish Product"}
          </button>
        </form>
      </div>
    </main>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  padding: 14,
  background: "#161616",
  border: "1px solid #2b2b2b",
  borderRadius: 10,
  color: "#fff",
};