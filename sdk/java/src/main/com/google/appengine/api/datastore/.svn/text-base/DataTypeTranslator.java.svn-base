// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Entity.UnindexedValue;
import com.google.appengine.api.users.User;
import com.google.common.collect.Maps;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;
import com.google.storage.onestore.v3.OnestoreEntity.Path;
import com.google.storage.onestore.v3.OnestoreEntity.Path.Element;
import com.google.storage.onestore.v3.OnestoreEntity.Property;
import com.google.storage.onestore.v3.OnestoreEntity.Property.Meaning;
import com.google.storage.onestore.v3.OnestoreEntity.PropertyValue;
import com.google.storage.onestore.v3.OnestoreEntity.PropertyValue.ReferenceValue;
import com.google.storage.onestore.v3.OnestoreEntity.PropertyValue.ReferenceValuePathElement;
import com.google.storage.onestore.v3.OnestoreEntity.PropertyValue.UserValue;
import com.google.storage.onestore.v3.OnestoreEntity.Reference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * {@code DataTypeTranslator} is a utility class for converting
 * between the data store's {@code Property} protocol buffers and the
 * user-facing classes ({@code String}, {@code User}, etc.).
 *
 */
public final class DataTypeTranslator  {

  private static final StringType STRING_TYPE = new StringType();

  /**
   * The list of supported types.
   *
   * Note: If you're going to modify this list, also update
   * DataTypeUtils. We're not building {@link DataTypeUtils#getSupportedTypes}
   * directly from this typeMap, because we want {@link DataTypeUtils} to be
   * translatable by GWT, so that {@link Entity Entities} can be easily sent
   * via GWT RPC.  Also, if you add a type here that is not immutable you'll
   * need to add special handling for it in {@link Entity#clone()}.
   */
  private static final Map<Class<?>, Type<?>> typeMap = Maps.newHashMap();
  static {
    typeMap.put(RawValue.class, new RawValueType());

    typeMap.put(Float.class, new DoubleType());
    typeMap.put(Double.class, new DoubleType());

    typeMap.put(Byte.class, new Int64Type());
    typeMap.put(Short.class, new Int64Type());
    typeMap.put(Integer.class, new Int64Type());
    typeMap.put(Long.class, new Int64Type());
    typeMap.put(Date.class, new DateType());
    typeMap.put(Rating.class, new RatingType());

    typeMap.put(String.class, STRING_TYPE);
    typeMap.put(Link.class, new LinkType());
    typeMap.put(ShortBlob.class, new ShortBlobType());
    typeMap.put(Category.class, new CategoryType());
    typeMap.put(PhoneNumber.class, new PhoneNumberType());
    typeMap.put(PostalAddress.class, new PostalAddressType());
    typeMap.put(Email.class, new EmailType());
    typeMap.put(IMHandle.class, new IMHandleType());
    typeMap.put(BlobKey.class, new BlobKeyType());
    typeMap.put(Blob.class, new BlobType());
    typeMap.put(Text.class, new TextType());
    typeMap.put(EmbeddedEntity.class, new EmbeddedEntityType());

    typeMap.put(Boolean.class, new BoolType());
    typeMap.put(User.class, new UserType());
    typeMap.put(Key.class, new ReferenceType());
    typeMap.put(GeoPt.class, new GeoPtType());

    assert typeMap.keySet().equals(DataTypeUtils.getSupportedTypes()) :
        "Warning:  DataTypeUtils and DataTypeTranslator do not agree " +
        "about supported classes: " + typeMap.keySet() + " vs. " +
        DataTypeUtils.getSupportedTypes();
  }

  /**
   * A map with the {@link Comparable} classes returned by all the instances of
   * {@link AsComparableFunction} as keys and the pb code point as the value.
   * Used for comparing values that don't map to the same pb code point.
   */
  private static final
  Map<Class<? extends Comparable<?>>, Integer> comparableTypeMap =
      new HashMap<Class<? extends Comparable<?>>, Integer>();

  static {
    comparableTypeMap.put(ComparableByteArray.class, PropertyValue.kstringValue);
    comparableTypeMap.put(Long.class, PropertyValue.kint64Value);
    comparableTypeMap.put(Double.class, PropertyValue.kdoubleValue);
    comparableTypeMap.put(Boolean.class, PropertyValue.kbooleanValue);
    comparableTypeMap.put(User.class, PropertyValue.kUserValueGroup);
    comparableTypeMap.put(Key.class, PropertyValue.kReferenceValueGroup);
    comparableTypeMap.put(GeoPt.class, PropertyValue.kPointValueGroup);
  }

  /**
   * Add all of the properties in the specified map to an {@code EntityProto}.
   * This involves determining the type of each property and creating the
   * proper type-specific protocol buffer.
   *
   * If the property value is an {@link UnindexedValue}, or if it's a
   * type that is never indexed, e.g. {@code Text} and {@code Blob}, it's
   * added to {@code EntityProto.raw_property}. Otherwise it's added to
   * {@code EntityProto.property}.
   *
   * @param map A not {@code null} map of all the properties which will
   * be set on {@code proto}
   * @param proto A not {@code null} protocol buffer
   */
  public static void addPropertiesToPb(Map<String, Object> map, EntityProto proto) {
    for (Map.Entry<String, Object> entry : map.entrySet()) {
      String key = entry.getKey();
      boolean indexed = !(entry.getValue() instanceof UnindexedValue);
      Object value = PropertyContainer.unwrapValue(entry.getValue());

      if (value instanceof Collection<?>) {
        Collection<?> values = (Collection<?>) value;
        if (values.isEmpty()) {
          addProperty(proto, key, null, indexed, false);
        } else {
          for (Object listValue : values) {
            addProperty(proto, key, listValue, indexed, true);
          }
        }
      } else {
        addProperty(proto, key, value, indexed, false);
      }
    }
  }

  /**
   * Adds a property to {@code entity}.
   *
   * @param entity a not {@code null} {@code EntityProto}
   * @param name the property name
   * @param value the property value
   * @param indexed whether this property should be indexed. This may be
   * overriden by property types like Blob and Text that are never indexed.
   * @param multiple whether this property has multiple values
   */
  private static void addProperty(EntityProto entity, String name, Object value,
                                  boolean indexed, boolean multiple) {
    Pair<Type<?>, Property> pair = createProperty(name, value, multiple);
    Type<?> type = pair.first();
    Property property = pair.second();

    if (!indexed || (type != null && type.getComparableFunction() == NOT_COMPARABLE)) {
      entity.addRawProperty(property);
    } else {
      entity.addProperty(property);
    }
  }

  /**
   * Creates a new {@link Property} given its {@code name}, {@code value},
   * and {@code multiplicity}.
   *
   * @param name The name used as a key
   * @param value The value for the Property
   * @param multiple true iff there are also other Properties with the same name
   *
   * @return a not {@code null} Pair<Type, Property>. The {@code Type} will be null
   * iff {@code value} is null. {@code Property} will not be null.
   */
  private static Pair<Type<?>, Property> createProperty(String name, Object value,
      boolean multiple) {
    Property property = new Property();
    property.setName(name);
    property.setMultiple(multiple);

    if (value == null) {
      return Pair.of(null, property);
    }

    Pair<Type<?>, PropertyValue> newValue = createPropertyValue(value);
    Type<?> type = newValue.first;
    Meaning meaning = type.getMeaning();
    if (meaning != Meaning.NO_MEANING) {
      property.setMeaning(meaning);
    }
    property.setValue(newValue.second);
    return new Pair<Type<?>, Property>(type, property);
  }

  private static Pair<Type<?>, PropertyValue> createPropertyValue(Object value) {
    if (value == null) {
      return Pair.of(null, null);
    }
    PropertyValue newValue = new PropertyValue();
    Type<?> type = getType(value.getClass());
    type.setPropertyValue(newValue, value);
    return new Pair<Type<?>, PropertyValue>(type, newValue);
  }

  /**
   * Copy all of the indexed properties present on {@code proto}
   * into {@code map}.
   */
  public static void extractIndexedPropertiesFromPb(EntityProto proto, Map<String, Object> map) {
    for (Property property : proto.propertys()) {
      addPropertyValueToMap(property, map, true);
    }
  }

  /**
   * Copy all of the unindexed properties present on {@code proto}
   * into {@code map}.
   */
  private static void extractUnindexedPropertiesFromPb(EntityProto proto, Map<String, Object> map) {
    for (Property property : proto.rawPropertys()) {
      addPropertyValueToMap(property, map, false);
    }
  }

  /**
   * Copy all of the properties present on {@code proto}
   * into {@code map}.
   */
  public static void extractPropertiesFromPb(EntityProto proto, Map<String, Object> map) {
    extractIndexedPropertiesFromPb(proto, map);
    extractUnindexedPropertiesFromPb(proto, map);
  }

  /**
   * Copy all of the implicit properties present on {@code proto}
   * into {@code map}.
   */
  public static void extractImplicitPropertiesFromPb(EntityProto proto, Map<String, Object> map) {
    for (Property property : getImplicitProperties(proto)) {
      addPropertyValueToMap(property, map, true);
    }
  }

  private static Iterable<Property> getImplicitProperties(EntityProto proto) {
    return Collections.singleton(buildImplicitKeyProperty(proto));
  }

  private static Property buildImplicitKeyProperty(EntityProto proto) {
    Property keyProp = new Property();
    keyProp.setName(Entity.KEY_RESERVED_PROPERTY);
    PropertyValue propVal = new PropertyValue();
    ReferenceType.setPropertyValue(propVal, proto.getKey());
    keyProp.setValue(propVal);
    return keyProp;
  }

  /**
   * Locates and returns all indexed properties with the given name on the
   * given proto.
   */
  public static Collection<Property> findIndexedPropertiesOnPb(
      EntityProto proto, String propertyName) {
    if (propertyName.equals(Entity.KEY_RESERVED_PROPERTY)) {
      return Collections.singleton(buildImplicitKeyProperty(proto));
    }
    Collection<Property> multipleProps = new ArrayList<Property>();
    Property singleProp = addPropertiesWithName(proto.propertys(), propertyName, multipleProps);
    if (singleProp != null) {
      return Collections.singleton(singleProp);
    }
    return multipleProps;
  }

  /**
   * Helper method that returns the first non-multiple property with the given name.
   * If a multiple property with the given name is encountered it is added to the
   * collection provided as an argument.
   *
   * @return A non-multiple property with the given name, or {@code null} if no
   * such property was found or all properties found were multiple properties.
   * If all properties found were multiple properties, the collection provided
   * as an argument will contain all these properties.
   */
  private static Property addPropertiesWithName(
      Iterable<Property> props, String propName, Collection<Property> matchingMultipleProps) {
    for (Property prop : props) {
      if (prop.getName().equals(propName)) {
        if (!prop.isMultiple()) {
          return prop;
        } else {
          matchingMultipleProps.add(prop);
        }
      }
    }
    return null;
  }

  private static void addPropertyValueToMap(
      Property property, Map<String, Object> map, boolean indexed) {
    String name = property.getName();
    Object value = getPropertyValue(property);

    if (property.isMultiple()) {
      @SuppressWarnings({"unchecked"})
      List<Object> results = (List<Object>) PropertyContainer.unwrapValue(map.get(name));
      if (results == null) {
        results = new ArrayList<Object>();
        map.put(name, indexed ? results : new UnindexedValue(results));
      }
      results.add(value);
    } else {
      map.put(name, indexed ? value : new UnindexedValue(value));
    }
  }

  /**
   * Returns the value for the property as its canonical type.
   *
   * @param property a not {@code null} property
   * @return {@code null} if no value was set for {@code property}
   */
  public static Object getPropertyValue(Property property) {
    PropertyValue value = property.getValue();
    for (Type<?> type : typeMap.values()) {
      if (type.hasPropertyValue(value) &&
          type.getMeaning() == property.getMeaningEnum()) {
        return type.getPropertyValue(value);
      }
    }
    return null;
  }

  /**
   * Returns the value for the property as its comparable representation type.
   *
   * @param property a not {@code null} property
   * @return {@code null} if no value was set for {@code property}
   */
  public static Comparable<Object> getComparablePropertyValue(Property property) {
    PropertyValue value = property.getValue();
    Meaning meaning = property.getMeaningEnum();
    for (Type<?> type : typeMap.values()) {
      if (type.hasPropertyValue(value) &&
          (meaning == Meaning.INDEX_VALUE || meaning == type.getMeaning()) &&
          type.getComparableFunction() != null) {
        return toComparableObject(
            type.getComparableFunction().asComparable(value));
      }
    }
    return null;
  }

  /**
   * Converts the given {@link Object} into a supported value then returns it as
   * a comparable object so it can be compared to other data types.
   *
   * @param value any Object that can be converted into a supported DataType
   * @return {@code null} if value is null
   * @throws UnsupportedOperationException if value is not supported
   */
  static Comparable<Object> getComparablePropertyValue(Object value) {
    Pair<Type<?>, PropertyValue> newValue = createPropertyValue(value);
    if (newValue.first != null) {
        return toComparableObject(
            newValue.first.getComparableFunction().asComparable(newValue.second));
    }
    return null;
  }

  /**
   * Isolating the warning suppression.
   */
  @SuppressWarnings("unchecked")
  private static <T> Comparable<Object> toComparableObject(final Comparable<T> original) {
    return (Comparable<Object>) original;
  }

  /**
   * Get the rank of the given datastore type relative to other datastore
   * types.  Note that datastore types do not necessarily have unique ranks.
   */
  @SuppressWarnings({"unchecked", "rawtypes"})
  public static int getTypeRank(Class<? extends Comparable> datastoreType) {
    return comparableTypeMap.get(datastoreType);
  }

  /**
   * Create a Property protobuffer that contains {@code propertyName}
   * and {@code value}.
   */
  static Property toProperty(String propertyName, Object value) {
    return createProperty(propertyName, value, false).second();
  }

  /**
   * Gets the {@link Type} that knows how to translate objects of
   * type {@code clazz} into protocol buffers that the data store can
   * handle.
   * @throws UnsupportedOperationException if clazz is not supported
   */
  @SuppressWarnings("unchecked")
  private static <T> Type<T> getType(Class<T> clazz) {
    if (typeMap.containsKey(clazz)) {
      return (Type<T>) typeMap.get(clazz);
    } else {
      throw new UnsupportedOperationException("Unsupported data type: " + clazz.getName());
    }
  }

  /**
   * A function that converts a {@link PropertyValue} to its {@link
   * Comparable} representation.
   */
  private interface AsComparableFunction {
    Comparable<?> asComparable(PropertyValue pv);
  }

  /**
   * {@code Type} is an abstract class that knows how to convert Java
   * objects of one or more types into a {@link PropertyValue}.
   *
   * @param <T> The canonical Java class for this type.
   */
  abstract static class Type<T> {

    private final Meaning meaning;

    protected Type(Meaning meaning) {
      this.meaning = meaning;
    }

    protected Type() {
      this(Meaning.NO_MEANING);
    }

    /**
     * Returns the {@link AsComparableFunction} for this {@code Type}, or
     * {@code null} if values of this type are not comparable.
     */
    public abstract AsComparableFunction getComparableFunction();

    /**
     * Returns the {@link Meaning} for this {@code Type}.
     *
     * @return A return value of {@link Meaning#NO_MEANING} indicates
     * there is no special meaning.
     */
    public Meaning getMeaning() {
      return meaning;
    }

    /**
     * Sets the value of {@code propertyValue} to {@code value}.
     * If {@code value} is null, and the type of its {@link PropertyValue}
     * attribute is primitive, then no update occurs.
     */
    public abstract void setPropertyValue(PropertyValue propertyValue, Object value);

    /**
     * Returns the value of {@code propertyValue} as its canonical Java type.
     *
     * @param propertyValue a not {@code null} value representing this {@code Type}
     * @return the standard representation of {@code value}. Will never be null
     * for attributes of a primitive type.
     * @throws NullPointerException if the property value doesn't exist.
     * Use {@link #hasPropertyValue} first to determine if the property exists.
     */
    public abstract T getPropertyValue(PropertyValue propertyValue);

    /**
     * Returns true if the property value exists.
     *
     * @param propertyValue a not {code null} property.
     * @return true iff the property value has been set.
     */
    public abstract boolean hasPropertyValue(PropertyValue propertyValue);
  }

  /**
   * Used by {@link Type}s that do not support comparison.
   */
  private static final AsComparableFunction NOT_COMPARABLE = null;

  /**
   * Converts a {@link PropertyValue} stored in the string field to a
   * {@link Comparable}.
   */
  private static final AsComparableFunction COMP_BYTE_ARRAY_FUNC = new AsComparableFunction() {
    @Override
    public Comparable<ComparableByteArray> asComparable(PropertyValue pv) {
      return new ComparableByteArray(pv.getStringValueAsBytes());
    }
  };

  private static class StringType extends Type<String> {

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      propertyValue.setStringValue((String) value);
    }

    @Override
    public String getPropertyValue(PropertyValue propertyValue) {
      return propertyValue.getStringValue();
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasStringValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return COMP_BYTE_ARRAY_FUNC;
    }
  }

  /**
   * Converts a {@link PropertyValue} stored in the string field to a
   * {@link Comparable}.
   */
  private static final AsComparableFunction COMP_RAW_VALUE_FUNC = new AsComparableFunction() {
    @SuppressWarnings("unchecked")
    @Override
    public Comparable<?> asComparable(PropertyValue pv) {
      if (pv.hasStringValue()) {
        return new ComparableByteArray(pv.getStringValueAsBytes());
      }
      return (Comparable<Object>) new RawValue(pv).getValue();
    }
  };

  private static class RawValueType extends Type<RawValue> {

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      throw new UnsupportedOperationException();
    }

    @Override
    public RawValue getPropertyValue(PropertyValue propertyValue) {
      return new RawValue(propertyValue);
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return COMP_RAW_VALUE_FUNC;
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return true;
    }

    @Override
    public Meaning getMeaning() {
      return Meaning.INDEX_VALUE;
    }
  }

  /**
   * Converts a {@link PropertyValue} stored in the int64 field to a
   * {@link Comparable}.
   */
  private static final AsComparableFunction INT_64_COMP_FUNC = new AsComparableFunction() {
    @Override
    public Comparable<Long> asComparable(PropertyValue pv) {
      return pv.getInt64Value();
    }
  };

  private static class Int64Type extends Type<Long> {

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      if (value != null) {
        propertyValue.setInt64Value(((Number) value).longValue());
      }
    }

    @Override
    public Long getPropertyValue(PropertyValue propertyValue) {
      return propertyValue.getInt64Value();
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasInt64Value();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return INT_64_COMP_FUNC;
    }
  }

  /**
   * Converts a {@link PropertyValue} stored in the double field to a
   * {@link Comparable}.
   */
  private static final AsComparableFunction DOUBLE_COMP_FUNC = new AsComparableFunction() {
    @Override
    public Comparable<Double> asComparable(PropertyValue pv) {
      return pv.getDoubleValue();
    }
  };

  private static class DoubleType extends Type<Double> {

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      if (value != null) {
        propertyValue.setDoubleValue(((Number) value).doubleValue());
      }
    }

    @Override
    public Double getPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasDoubleValue() ? propertyValue.getDoubleValue() : null;
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasDoubleValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return DOUBLE_COMP_FUNC;
    }
  }

  /**
   * Converts a {@link PropertyValue} stored in the boolean field to a
   * {@link Comparable}.
   */
  private static final AsComparableFunction BOOLEAN_COMP_FUNC = new AsComparableFunction() {
    @Override
    public Comparable<Boolean> asComparable(PropertyValue pv) {
      return pv.isBooleanValue();
    }
  };

  private static class BoolType extends Type<Boolean> {

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      if (value != null) {
        propertyValue.setBooleanValue((Boolean) value);
      }
    }

    @Override
    public Boolean getPropertyValue(PropertyValue propertyValue) {
      return propertyValue.isBooleanValue();
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasBooleanValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return BOOLEAN_COMP_FUNC;
    }
  }

  private static class UserType extends Type<User> {

    private final AsComparableFunction USER_COMP_FUNC = new AsComparableFunction() {
      @Override
      public Comparable<User> asComparable(PropertyValue pv) {
        return getPropertyValue(pv);
      }
    };

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      User user = (User) value;
      UserValue userValue = new UserValue();
      userValue.setEmail(user.getEmail());
      userValue.setAuthDomain(user.getAuthDomain());
      userValue.setGaiaid(0);
      propertyValue.setUserValue(userValue);
    }

    @Override
    public User getPropertyValue(PropertyValue propertyValue) {
      UserValue userValue = propertyValue.getUserValue();
      String userId = userValue.hasObfuscatedGaiaid() ? userValue.getObfuscatedGaiaid() : null;
      return new User(userValue.getEmail(), userValue.getAuthDomain(), userId);
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasUserValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return USER_COMP_FUNC;
    }
  }

  private static class ReferenceType extends Type<Key> {
    private final AsComparableFunction COMP_FUNC = new AsComparableFunction() {
      @Override
      public Comparable<Key> asComparable(PropertyValue pv) {
        return getPropertyValue(pv);
      }
    };

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      Reference keyRef = KeyTranslator.convertToPb((Key) value);
      setPropertyValue(propertyValue, keyRef);
    }

    private static void setPropertyValue(PropertyValue propertyValue, Reference keyRef) {
      ReferenceValue refValue = new ReferenceValue();
      refValue.setApp(keyRef.getApp());
      if (keyRef.hasNameSpace()) {
        refValue.setNameSpace(keyRef.getNameSpace());
      }
      Path path = keyRef.getPath();
      for (Element element : path.elements()) {
        ReferenceValuePathElement newElement = new ReferenceValuePathElement();
        newElement.setType(element.getType());
        if (element.hasName()) {
          newElement.setName(element.getName());
        }
        if (element.hasId()) {
          newElement.setId(element.getId());
        }
        refValue.addPathElement(newElement);
      }

      propertyValue.setReferenceValue(refValue);
    }

    @Override
    public Key getPropertyValue(PropertyValue propertyValue) {

      Reference reference = new Reference();
      ReferenceValue refValue = propertyValue.getReferenceValue();
      reference.setApp(refValue.getApp());
      if (refValue.hasNameSpace()) {
        reference.setNameSpace(refValue.getNameSpace());
      }
      Path path = new Path();
      for (ReferenceValuePathElement element : refValue.pathElements()) {
        Element newElement = new Element();
        newElement.setType(element.getType());
        if (element.hasName()) {
          newElement.setName(element.getName());
        }
        if (element.hasId()) {
          newElement.setId(element.getId());
        }
        path.addElement(newElement);
      }
      reference.setPath(path);

      return KeyTranslator.createFromPb(reference);
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasReferenceValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return COMP_FUNC;
    }
  }

  private static class BlobType extends Type<Blob> {
    private BlobType() {
      super(Meaning.BLOB);
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      Blob blob = (Blob) value;
      propertyValue.setStringValueAsBytes(blob.getBytes());
    }

    @Override
    public Blob getPropertyValue(PropertyValue propertyValue) {
      byte[] bytes = propertyValue.getStringValueAsBytes();
      return new Blob(bytes);
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasStringValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return NOT_COMPARABLE;
    }
  }

  private static class EmbeddedEntityType extends Type<EmbeddedEntity> {
    private EmbeddedEntityType() {
      super(Meaning.ENTITY_PROTO);
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      EmbeddedEntity structProp = (EmbeddedEntity) value;
      EntityProto proto = new EntityProto();
      if (structProp.getKey() != null) {
        proto.setKey(KeyTranslator.convertToPb(structProp.getKey()));
      }
      addPropertiesToPb(structProp.getPropertyMap(), proto);
      propertyValue.setStringValueAsBytes(proto.toByteArray());
    }

    @Override
    public EmbeddedEntity getPropertyValue(PropertyValue propertyValue) {
      EntityProto proto = new EntityProto();
      proto.mergeFrom(propertyValue.getStringValueAsBytes());
      EmbeddedEntity result = new EmbeddedEntity();
      if (proto.hasKey() && !proto.getKey().getApp().isEmpty()) {
        result.setKey(KeyTranslator.createFromPb(proto.getKey()));
      }
      extractPropertiesFromPb(proto, result.getPropertyMap());
      return result;
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasStringValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return NOT_COMPARABLE;
    }
  }

  private static class TextType extends Type<Text> {
    private TextType() {
      super(Meaning.TEXT);
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      Text text = (Text) value;
      propertyValue.setStringValue(text.getValue());
    }

    @Override
    public Text getPropertyValue(PropertyValue propertyValue) {
      return new Text(propertyValue.getStringValue());
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasStringValue();
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return NOT_COMPARABLE;
    }
  }

  private static class BlobKeyType extends CustomStringType<BlobKey> {
    private BlobKeyType() {
      super(Meaning.BLOBKEY);
    }

    @Override
    protected String asDatastoreString(Object value) {
      return ((BlobKey) value).getKeyString();
    }

    @Override
    protected BlobKey fromDatastoreString(String datastoreString) {
      return new BlobKey(datastoreString);
    }
  }

  private static class DateType extends Type<Date> {
    private DateType() {
      super(Meaning.GD_WHEN);
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      Date date = (Date) value;
      propertyValue.setInt64Value(date.getTime() * 1000L);
    }

    @Override
    public Date getPropertyValue(PropertyValue propertyValue) {
      return new Date(propertyValue.getInt64Value() / 1000L);
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return INT_64_COMP_FUNC;
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasInt64Value();
    }
  }

  private static class LinkType extends Type<Link> {
    private LinkType() {
      super(Meaning.ATOM_LINK);
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      Link link = (Link) value;
      propertyValue.setStringValue(link.getValue());
    }

    @Override
    public Link getPropertyValue(PropertyValue propertyValue) {
      return new Link(propertyValue.getStringValue());
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return COMP_BYTE_ARRAY_FUNC;
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasStringValue();
    }
  }

  private static class ShortBlobType extends Type<ShortBlob> {
    private ShortBlobType() {
      super(Meaning.BYTESTRING);
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      propertyValue.setStringValueAsBytes(((ShortBlob) value).getBytes());
    }

    @Override
    public ShortBlob getPropertyValue(PropertyValue propertyValue) {
      return new ShortBlob(propertyValue.getStringValueAsBytes());
    }

    @Override
    public AsComparableFunction getComparableFunction() {
      return COMP_BYTE_ARRAY_FUNC;
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasStringValue();
    }
  }

  /**
   * Base class for types that are basically just string wrappers.
   *
   * Delegates to a StringType instance because the parameterized type
   * prevents us from extending StringType.
   */
  private static abstract class CustomStringType<T> extends Type<T> {

    private CustomStringType(Meaning meaning) {
      super(meaning);
    }

    @Override
    public final void setPropertyValue(PropertyValue propertyValue, Object value) {
      STRING_TYPE.setPropertyValue(propertyValue, asDatastoreString(value));
    }

    @Override
    public final T getPropertyValue(PropertyValue propertyValue) {
      return fromDatastoreString(STRING_TYPE.getPropertyValue(propertyValue));
    }

    @Override
    public final AsComparableFunction getComparableFunction() {
      return STRING_TYPE.getComparableFunction();
    }

    @Override
    public final boolean hasPropertyValue(PropertyValue propertyValue) {
      return STRING_TYPE.hasPropertyValue(propertyValue);
    }

    protected abstract String asDatastoreString(Object value);
    protected abstract T fromDatastoreString(String datastoreString);
  }

  /**
   * Base class for types that are basically just int64 wrappers.
   *
   * Delegates to a Int64Type instance because the parameterized type
   * prevents us from extending Int64Type.
   */
  private static abstract class CustomInt64Type<T> extends Type<T> {

    private static final Int64Type INT64_TYPE = new Int64Type();

    private CustomInt64Type(Meaning meaning) {
      super(meaning);
    }

    @Override
    public final void setPropertyValue(PropertyValue propertyValue, Object value) {
      INT64_TYPE.setPropertyValue(propertyValue, asDatastoreLong(value));
    }

    @Override
    public final T getPropertyValue(PropertyValue propertyValue) {
      return fromDatastoreLong(INT64_TYPE.getPropertyValue(propertyValue));
    }

    @Override
    public final AsComparableFunction getComparableFunction() {
      return INT64_TYPE.getComparableFunction();
    }

    @Override
    public final boolean hasPropertyValue(PropertyValue propertyValue) {
      return INT64_TYPE.hasPropertyValue(propertyValue);
    }

    protected abstract Long asDatastoreLong(Object value);
    protected abstract T fromDatastoreLong(Long datastoreLong);
  }

  /**
   * Internally a category is just a string with a special meaning.
   */
  private static class CategoryType extends CustomStringType<Category> {
    private CategoryType() {
      super(Meaning.ATOM_CATEGORY);
    }

    @Override
    protected String asDatastoreString(Object value) {
      return ((Category) value).getCategory();
    }

    @Override
    protected Category fromDatastoreString(String datastoreString) {
      return new Category(datastoreString);
    }
  }

  /**
   * Internally a category is just an int64 with a special meaning.
   */
  private static class RatingType extends CustomInt64Type<Rating> {

    private RatingType() {
      super(Meaning.GD_RATING);
    }

    @Override
    protected Long asDatastoreLong(Object value) {
      return (long) ((Rating) value).getRating();
    }

    @Override
    protected Rating fromDatastoreLong(Long datastoreLong) {
      if (datastoreLong == null) {
        throw new NullPointerException("rating value cannot be null");
      }
      return new Rating(datastoreLong.intValue());
    }
  }

  /**
   * Internally an email is just a string with a special meaning.
   */
  private static class EmailType extends CustomStringType<Email> {
    private EmailType() {
      super(Meaning.GD_EMAIL);
    }

    @Override
    protected String asDatastoreString(Object value) {
      return ((Email) value).getEmail();
    }

    @Override
    protected Email fromDatastoreString(String datastoreString) {
      return new Email(datastoreString);
    }
  }

  /**
   * Internally a postal address is just a string with a special meaning.
   */
  private static class PostalAddressType extends CustomStringType<PostalAddress> {
    private PostalAddressType() {
      super(Meaning.GD_POSTALADDRESS);
    }

    @Override
    protected String asDatastoreString(Object value) {
      return ((PostalAddress) value).getAddress();
    }

    @Override
    protected PostalAddress fromDatastoreString(String datastoreString) {
      return new PostalAddress(datastoreString);
    }
  }

  /**
   * Internally a phone number is just a string with a special meaning.
   */
  private static class PhoneNumberType extends CustomStringType<PhoneNumber> {
    private PhoneNumberType() {
      super(Meaning.GD_PHONENUMBER);
    }

    @Override
    protected String asDatastoreString(Object value) {
      return ((PhoneNumber) value).getNumber();
    }

    @Override
    protected PhoneNumber fromDatastoreString(String datastoreString) {
      return new PhoneNumber(datastoreString);
    }
  }

  /**
   * Internally an im handle is just a string with a special meaning and a
   * well known format.
   */
  private static class IMHandleType extends CustomStringType<IMHandle> {

    private IMHandleType() {
      super(Meaning.GD_IM);
    }

    @Override
    protected String asDatastoreString(Object value) {
      return ((IMHandle) value).toDatastoreString();
    }

    @Override
    protected IMHandle fromDatastoreString(String datastoreString) {
      return IMHandle.fromDatastoreString(datastoreString);
    }
  }

  private static class GeoPtType extends Type<GeoPt> {

    private GeoPtType() {
      super(Meaning.GEORSS_POINT);
    }

    /**
     * Converts a {@link PropertyValue} stored in the pointValue field to a
     * {@link Comparable}.
     */
    private final AsComparableFunction POINT_VALUE_COMP_FUNC = new AsComparableFunction() {
      @Override
      public Comparable<GeoPt> asComparable(PropertyValue pv) {
        return getPropertyValue(pv);
      }
    };

    @Override
    public AsComparableFunction getComparableFunction() {
      return POINT_VALUE_COMP_FUNC;
    }

    @Override
    public void setPropertyValue(PropertyValue propertyValue, Object value) {
      GeoPt geoPt = (GeoPt) value;
      PropertyValue.PointValue pv =
          new PropertyValue.PointValue().setX(geoPt.getLatitude()).setY(geoPt.getLongitude());
      propertyValue.setPointValue(pv);
    }

    @Override
    public GeoPt getPropertyValue(PropertyValue propertyValue) {
      PropertyValue.PointValue pv = propertyValue.getPointValue();
      return new GeoPt((float) pv.getX(), (float) pv.getY());
    }

    @Override
    public boolean hasPropertyValue(PropertyValue propertyValue) {
      return propertyValue.hasPointValue();
    }
  }

  private static class Pair<T, U> {

    private final T first;

    private final U second;

    Pair(T t, U u) {
      first = t;
      second = u;
    }

    T first() {
      return first;
    }

    U second() {
      return second;
    }

    public static <T, U> Pair<T, U> of(T t, U u) {
      return new Pair<T, U>(t, u);
    }
  }

  static Map<Class<?>, Type<?>> getTypeMap() {
    return typeMap;
  }

  /**
   * A wrapper for a {@code byte[]} that implements {@link Comparable}.
   * Comparison algorithm is the same as the prod datastore.
   */
  public static final class ComparableByteArray implements Comparable<ComparableByteArray> {

    private final byte[] bytes;

    public ComparableByteArray(byte[] bytes) {
      this.bytes = bytes;
    }

    @Override
    public int compareTo(ComparableByteArray other) {
      byte[] otherBytes = other.bytes;
      for (int i = 0; i < Math.min(bytes.length, otherBytes.length); i++) {
        int v1 = bytes[i] & 0xFF;
        int v2 = otherBytes[i] & 0xFF;
        if (v1 != v2) {
          return v1 - v2;
        }
      }
      return bytes.length - otherBytes.length;
    }

    @Override
    public boolean equals(Object obj) {
      if (obj == null) {
        return false;
      }
      return Arrays.equals(bytes, ((ComparableByteArray) obj).bytes);
    }

    @Override
    public int hashCode() {
      int result = 1;
      for (byte b : bytes) {
        result = 31 * result + b;
      }
      return result;
    }
  }

  private DataTypeTranslator() {
  }
}
