import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Plus } from "lucide-react";
import {
  fetchVariations,
  createVariation,
  updateVariation,
  deleteVariation,
  linkVariationCategories,
  fetchActiveCategories,
} from "../services/api";
import {
  AttributesTable,
  AttributeForm,
  CategoryLinkingModal,
  DeleteConfirmModal,
  Attribute,
  Category,
  AttributeFormData,
  Pagination,
} from "../components/attributes";

export default function Attributes() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(
    null
  );
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [linkingCategories, setLinkingCategories] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 5,
    totalPages: 1,
    totalItems: 0,
  });

  const [formData, setFormData] = useState<AttributeFormData>({
    name: "",
    type: "text",
    options: [""],
    values: [""],
    optionIds: [],
    deleteOptionIds: [],
    group: "",
    isRequired: false,
    sortOrder: 1,
    linkedCategories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [variationsResponse, categoriesResponse] = await Promise.all([
          fetchVariations(pagination.page, pagination.limit),
          fetchActiveCategories(1, 100),
        ]);

        if (variationsResponse.success) {
          const { data, meta } = variationsResponse.data;

          const transformedAttributes = data.map((variation: any) => ({
            id: variation.id,
            name: variation.name,
            type:
              variation.type === "number"
                ? "number"
                : variation.type === "select"
                ? "select"
                : variation.type === "color"
                ? "color"
                : "text",
            optionIds:
              variation.variationOptions?.map((opt: any) => opt.id) || [],
            options:
              variation.variationOptions?.map((opt: any) => opt.name) || [],
            values:
              variation.variationOptions?.map((opt: any) => opt.value) || [],
            group: variation.group,
            isRequired:
              variation.isRequire === "true" || variation.isRequire === true,
            sortOrder: variation.order,
            linkedCategories: variation.categories || [],
          }));

          setAttributes(transformedAttributes);

          // ✅ save pagination info from backend
          setPagination({
            page: meta.page,
            limit: meta.limit,
            totalPages: meta.totalPages,
            totalItems: meta.totalItems,
          });
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit]);

  const handleOpenModal = () => {
    setFormData({
      name: "",
      type: "text",
      options: [""],
      values: [""],
      optionIds: [],
      deleteOptionIds: [],
      group: "",
      isRequired: false,
      sortOrder: attributes.length + 1,
      linkedCategories: [],
    });
    setEditingAttribute(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAttribute(null);
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setFormData({
      name: attribute.name,
      type: attribute.type,
      options: [...attribute.options],
      values: [...attribute.values],
      optionIds: attribute.optionIds || [],
      deleteOptionIds: [],
      group: attribute.group,
      isRequired: attribute.isRequired,
      sortOrder: attribute.sortOrder,
      linkedCategories: [...attribute.linkedCategories],
    });
    setEditingAttribute(attribute);
    setModalOpen(true);
  };

  const handleDeleteAttribute = (attribute: Attribute) => {
    setAttributeToDelete(attribute);
    setDeleteModalOpen(true);
  };

  const handleLinkCategories = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setFormData({
      ...formData,
      linkedCategories: [...attribute.linkedCategories],
    });
    setCategoryModalOpen(true);
  };

  const confirmDeleteAttribute = async () => {
    if (attributeToDelete) {
      try {
        setDeleting(true);
        await deleteVariation(attributeToDelete.id);
        setAttributes(
          attributes.filter((attr) => attr.id !== attributeToDelete.id)
        );
        setDeleteModalOpen(false);
        setAttributeToDelete(null);
      } catch (err: any) {
        setError(err.message || "Failed to delete attribute");
        console.error("Error deleting attribute:", err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
      values: [...formData.values, ""],
    });
  };
  const handleRemoveOption = (index: number) => {
    const deletedId = formData.optionIds[index];

    const newOptions = [...formData.options];
    const newValues = [...formData.values];
    const newOptionIds = [...formData.optionIds];

    newOptions.splice(index, 1);
    newValues.splice(index, 1);
    newOptionIds.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      options: newOptions,
      values: newValues,
      optionIds: newOptionIds,
      deleteOptionIds: deletedId
        ? [...prev.deleteOptionIds, deletedId]
        : prev.deleteOptionIds,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = value;
    setFormData({ ...formData, values: newValues });
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleCategoryToggle = (categoryId: string) => {
    const isLinked = formData.linkedCategories.includes(categoryId);
    if (isLinked) {
      setFormData({
        ...formData,
        linkedCategories: formData.linkedCategories.filter(
          (cat) => cat !== categoryId
        ),
      });
    } else {
      setFormData({
        ...formData,
        linkedCategories: [...formData.linkedCategories, categoryId],
      });
    }
  };

  const handleSaveCategories = async () => {
    if (selectedAttribute) {
      try {
        setSavingCategories(true);
        console.log("Linking categories for variation:", selectedAttribute.id);
        console.log("Categories to link:", formData.linkedCategories);

        await linkVariationCategories(
          selectedAttribute.id,
          formData.linkedCategories
        );

        console.log("Categories linked successfully");

        setAttributes(
          attributes.map((attr) =>
            attr.id === selectedAttribute.id
              ? { ...attr, linkedCategories: formData.linkedCategories }
              : attr
          )
        );
        setCategoryModalOpen(false);
        setSelectedAttribute(null);
      } catch (err: any) {
        setError(err.message || "Failed to link categories");
        console.error("Error linking categories:", err);
      } finally {
        setSavingCategories(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const variationData = {
        name: formData.name,
        type: formData.type,
        group: formData.group,
        isRequire: formData.isRequired.toString(),
        order: formData.sortOrder,

        options: formData.options
          .filter((opt, index) => {
            const value = formData.values?.[index] || "";
            return opt?.trim() !== "" && value.trim() !== "";
          })
          .map((opt, index) => {
            const option: any = {
              name: opt,
              value: formData.values?.[index] || opt,
            };

            if (formData.optionIds?.[index]) {
              option.id = formData.optionIds[index];
            }

            return option;
          }),

        deleteOptionIds: formData.deleteOptionIds || [],
      };

      if (editingAttribute) {
        console.log("variationData", variationData);
        const response = await updateVariation(
          editingAttribute.id,
          variationData
        );
        if (response.success) {
          const updatedAttribute = {
            id: editingAttribute.id,
            name: formData.name,
            type: formData.type,
            options: formData.options.filter((opt) => opt.trim() !== ""),
            values: formData.values.filter((val) => val.trim() !== ""),
            optionIds: formData.optionIds, // <-- Add this line
            group: formData.group,
            isRequired: formData.isRequired,
            sortOrder: formData.sortOrder,
            linkedCategories: formData.linkedCategories,
          };
          setAttributes(
            attributes.map((attr) =>
              attr.id === editingAttribute.id ? updatedAttribute : attr
            )
          );

          if (formData.linkedCategories.length > 0) {
            try {
              setLinkingCategories(true);
              await linkVariationCategories(
                editingAttribute.id,
                formData.linkedCategories
              );
            } catch (err: any) {
              console.error("Error linking categories:", err);
            } finally {
              setLinkingCategories(false);
            }
          }
        }
      } else {
        const response = await createVariation(variationData);
        if (response.success) {
          const newAttribute = {
            id: response.data.id,
            name: formData.name,
            type: formData.type,
            options: formData.options.filter((opt) => opt.trim() !== ""),
            values: formData.values.filter((val) => val.trim() !== ""),
            optionIds: formData.optionIds, // <-- Add this line
            group: formData.group,
            isRequired: formData.isRequired,
            sortOrder: formData.sortOrder,
            linkedCategories: formData.linkedCategories,
          };
          setAttributes([...attributes, newAttribute]);

          // Link categories if any are selected
          if (formData.linkedCategories.length > 0) {
            try {
              setLinkingCategories(true);
              await linkVariationCategories(
                response.data.id,
                formData.linkedCategories
              );
            } catch (err: any) {
              console.error("Error linking categories:", err);
              // Don't fail the creation if category linking fails
            } finally {
              setLinkingCategories(false);
            }
          }
        }
      }

      setModalOpen(false);
      setEditingAttribute(null);
    } catch (err: any) {
      setError(err.message || "Failed to save attribute");
      console.error("Error saving attribute:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attribute & Variation
            </h1>
            <p className="text-gray-600">
              Manage product attributes and variations.
            </p>
          </div>
        </div>
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading attributes...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attribute & Variation
            </h1>
            <p className="text-gray-600">
              Manage product attributes and variations.
            </p>
          </div>
        </div>
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attribute & Variation
          </h1>
          <p className="text-gray-600">
            Manage product attributes and variations.
          </p>
        </div>
        <Button onClick={handleOpenModal} icon={Plus}>
          Add Attribute
        </Button>
      </div>

      <AttributesTable
        attributes={attributes}
        categories={categories}
        onEditAttribute={handleEditAttribute}
        onDeleteAttribute={handleDeleteAttribute}
        onLinkCategories={handleLinkCategories}
        linkingCategories={linkingCategories}
        submitting={submitting}
        deleting={deleting}
        getCategoryName={getCategoryName}
      />

      <AttributeForm
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editingAttribute={editingAttribute}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        onAddOption={handleAddOption}
        onRemoveOption={handleRemoveOption}
        onOptionChange={handleOptionChange}
        onValueChange={handleValueChange}
        onCategoryToggle={handleCategoryToggle}
        categories={categories}
        submitting={submitting}
      />

      <CategoryLinkingModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        selectedAttribute={selectedAttribute}
        formData={formData}
        onFormDataChange={setFormData}
        onCategoryToggle={handleCategoryToggle}
        onSave={handleSaveCategories}
        categories={categories}
        savingCategories={savingCategories}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        attributeToDelete={attributeToDelete}
        onConfirm={confirmDeleteAttribute}
        deleting={deleting}
      />
    </div>
  );
}
